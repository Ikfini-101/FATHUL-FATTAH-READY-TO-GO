import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import * as keycloak from "./keycloak";
import jwt from "jsonwebtoken";
import { ENV } from "./env";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  // Route callback OAuth - supporte Keycloak et Manus OAuth
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    // Vérifier si Keycloak est configuré
    const useKeycloak = keycloak.isKeycloakConfigured();

    if (useKeycloak) {
      // ========== MODE KEYCLOAK ==========
      if (!code) {
        res.status(400).json({ error: "code is required" });
        return;
      }

      try {
        // Échanger code contre token
        const tokenResponse = await keycloak.exchangeCodeForToken(code);
        const accessToken = tokenResponse.access_token;
        const refreshToken = tokenResponse.refresh_token;

        // Décoder le token pour récupérer les infos utilisateur
        const tokenClaims = await keycloak.verifyToken(accessToken);

        // Extraire les informations utilisateur
        const openId = tokenClaims.sub; // Subject = unique user ID
        const name = tokenClaims.name || tokenClaims.preferred_username;
        const email = tokenClaims.email;

        // Extraire et mapper les rôles
        const keycloakRoles = keycloak.extractUserRoles(tokenClaims);
        const appRole = keycloak.mapKeycloakRoleToAppRole(keycloakRoles);

        // Créer ou mettre à jour l'utilisateur
        await db.upsertUser({
          openId,
          name: name || null,
          email: email || null,
          loginMethod: "keycloak",
          role: appRole,
          lastSignedIn: new Date(),
        });

        // Créer un JWT session token avec les infos utilisateur
        const sessionToken = jwt.sign(
          {
            openId,
            name,
            email,
            role: appRole,
          },
          ENV.cookieSecret,
          { expiresIn: "30d" }
        );

        const cookieOptions = getSessionCookieOptions(req);
        res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        res.redirect(302, "/");
      } catch (error) {
        console.error("[Keycloak] Callback failed", error);
        res.status(500).json({ error: "Keycloak authentication failed" });
      }
    } else {
      // ========== MODE MANUS OAUTH (FALLBACK) ==========
      if (!code || !state) {
        res.status(400).json({ error: "code and state are required" });
        return;
      }

      try {
        const tokenResponse = await sdk.exchangeCodeForToken(code, state);
        const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

        if (!userInfo.openId) {
          res.status(400).json({ error: "openId missing from user info" });
          return;
        }

        await db.upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: new Date(),
        });

        const sessionToken = await sdk.createSessionToken(userInfo.openId, {
          name: userInfo.name || "",
          expiresInMs: ONE_YEAR_MS,
        });

        const cookieOptions = getSessionCookieOptions(req);
        res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        res.redirect(302, "/");
      } catch (error) {
        console.error("[OAuth] Callback failed", error);
        res.status(500).json({ error: "OAuth callback failed" });
      }
    }
  });

  // Route pour obtenir l'URL de login
  app.get("/api/auth/login-url", (req: Request, res: Response) => {
    const useKeycloak = keycloak.isKeycloakConfigured();

    if (useKeycloak) {
      const loginUrl = keycloak.getKeycloakLoginUrl();
      res.json({ url: loginUrl, provider: "keycloak" });
    } else {
      // Retourner l'URL Manus OAuth (implémentation existante)
      res.json({ provider: "manus" });
    }
  });
}

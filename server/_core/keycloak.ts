/**
 * Keycloak OpenID Connect Configuration
 * Remplace l'authentification OAuth Manus par Keycloak self-hosted
 * Utilise HTTP direct + JWT pour plus de stabilité
 */

import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { Request, Response } from "express";

// Configuration Keycloak depuis variables d'environnement
const KEYCLOAK_URL = process.env.KEYCLOAK_URL || "http://localhost:8080";
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || "fathul-fattah";
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || "admin-web";
const KEYCLOAK_CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET || "";
const APP_URL = process.env.APP_URL || "http://localhost:3000";

// JWKS client pour vérifier les signatures JWT
let jwksClientInstance: jwksClient.JwksClient | null = null;

/**
 * Initialise le client JWKS pour vérifier les tokens Keycloak
 */
export async function initializeKeycloak(): Promise<void> {
  try {
    const jwksUri = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`;
    console.log(`[Keycloak] Initializing JWKS client: ${jwksUri}`);

    jwksClientInstance = jwksClient({
      jwksUri,
      cache: true,
      cacheMaxAge: 600000, // 10 minutes
    });

    console.log("[Keycloak] JWKS client initialized successfully");
  } catch (error) {
    console.error("[Keycloak] Initialization failed:", error);
    throw error;
  }
}

/**
 * Génère l'URL de connexion Keycloak
 */
export function getKeycloakLoginUrl(redirectUri?: string): string {
  const redirect = redirectUri || `${APP_URL}/api/auth/callback`;
  const authEndpoint = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth`;

  const params = new URLSearchParams({
    client_id: KEYCLOAK_CLIENT_ID,
    redirect_uri: redirect,
    response_type: "code",
    scope: "openid email profile",
  });

  return `${authEndpoint}?${params.toString()}`;
}

/**
 * Échange le code d'autorisation contre un token
 */
export async function exchangeCodeForToken(code: string, redirectUri?: string): Promise<any> {
  const redirect = redirectUri || `${APP_URL}/api/auth/callback`;
  const tokenEndpoint = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: KEYCLOAK_CLIENT_ID,
    client_secret: KEYCLOAK_CLIENT_SECRET,
    code,
    redirect_uri: redirect,
  });

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return await response.json();
}

/**
 * Récupère les informations utilisateur depuis le token
 */
export async function getUserInfo(accessToken: string): Promise<any> {
  const userinfoEndpoint = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/userinfo`;

  const response = await fetch(userinfoEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  return await response.json();
}

/**
 * Vérifie et décode un JWT token
 */
export async function verifyToken(token: string): Promise<any> {
  if (!jwksClientInstance) {
    throw new Error("JWKS client not initialized");
  }

  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      async (header, callback) => {
        try {
          const key = await jwksClientInstance!.getSigningKey(header.kid);
          const signingKey = key.getPublicKey();
          callback(null, signingKey);
        } catch (error) {
          callback(error as Error);
        }
      },
      {
        audience: KEYCLOAK_CLIENT_ID,
        issuer: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`,
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      }
    );
  });
}

/**
 * Extrait les rôles de l'utilisateur depuis le token décodé
 */
export function extractUserRoles(tokenClaims: any): string[] {
  // Keycloak stocke les rôles dans resource_access[client_id].roles
  const resourceAccess = tokenClaims.resource_access || {};
  const clientRoles = resourceAccess[KEYCLOAK_CLIENT_ID]?.roles || [];

  // Ajouter aussi les realm roles
  const realmRoles = tokenClaims.realm_access?.roles || [];

  return [...clientRoles, ...realmRoles];
}

/**
 * Détermine le rôle application depuis les rôles Keycloak
 */
export function mapKeycloakRoleToAppRole(keycloakRoles: string[]): "admin" | "user" {
  // Si l'utilisateur a le rôle "admin" dans Keycloak, il est admin
  if (keycloakRoles.includes("admin") || keycloakRoles.includes("administrator")) {
    return "admin";
  }
  return "user";
}

/**
 * Décode un token JWT sans vérification (pour debug)
 */
export function decodeToken(token: string): any {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error("[Keycloak] Token decode failed:", error);
    return null;
  }
}

/**
 * Rafraîchit un access token avec un refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<any> {
  const tokenEndpoint = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: KEYCLOAK_CLIENT_ID,
    client_secret: KEYCLOAK_CLIENT_SECRET,
    refresh_token: refreshToken,
  });

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  return await response.json();
}

/**
 * Déconnecte un utilisateur (révoque le token)
 */
export async function logoutUser(refreshToken: string): Promise<void> {
  const logoutEndpoint = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/logout`;

  const params = new URLSearchParams({
    client_id: KEYCLOAK_CLIENT_ID,
    client_secret: KEYCLOAK_CLIENT_SECRET,
    refresh_token: refreshToken,
  });

  await fetch(logoutEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
}

/**
 * Vérifie si Keycloak est configuré
 */
export function isKeycloakConfigured(): boolean {
  return !!(
    process.env.KEYCLOAK_URL &&
    process.env.KEYCLOAK_REALM &&
    process.env.KEYCLOAK_CLIENT_ID &&
    process.env.KEYCLOAK_CLIENT_SECRET
  );
}

/**
 * Retourne la configuration Keycloak (pour debug)
 */
export function getKeycloakConfig() {
  return {
    url: KEYCLOAK_URL,
    realm: KEYCLOAK_REALM,
    clientId: KEYCLOAK_CLIENT_ID,
    appUrl: APP_URL,
    configured: isKeycloakConfigured(),
  };
}

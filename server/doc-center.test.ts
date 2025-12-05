import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";

// Mock context pour les tests
const mockContext: Context = {
  req: {} as any,
  res: {} as any,
  user: {
    id: 1,
    openId: "test-user",
    name: "Test User",
    email: "test@example.com",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    loginMethod: "oauth",
  },
};

const caller = appRouter.createCaller(mockContext);

describe("Centre de Documentation - API Tests", () => {
  describe("Catalogue Public", () => {
    it("devrait rechercher des documents", async () => {
      const result = await caller.docCatalog.search({
        query: "",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("devrait filtrer par type de document", async () => {
      const result = await caller.docCatalog.search({
        query: "",
        type: "manuscript",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("devrait filtrer par langue", async () => {
      const result = await caller.docCatalog.search({
        query: "",
        language: "ar",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Admin - Documents", () => {
    it("devrait lister les documents", async () => {
      const result = await caller.docItems.list();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Admin - Demandes de Reprographie", () => {
    it("devrait lister les demandes de reprographie", async () => {
      const result = await caller.docRepro.list();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

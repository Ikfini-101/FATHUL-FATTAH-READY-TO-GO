import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";

// ============================================
// MIDDLEWARE POUR VÉRIFIER LES PERMISSIONS
// ============================================

/**
 * Middleware pour vérifier qu'un utilisateur a une permission spécifique
 */
const requirePermission = (permissionName: string) =>
  protectedProcedure.use(async ({ ctx, next }) => {
    const hasPermission = await db.checkUserPermission(ctx.user.id, permissionName);
    
    if (!hasPermission) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Permission requise: ${permissionName}`,
      });
    }
    
    return next({ ctx });
  });

// ============================================
// ROUTER UTILISATEURS
// ============================================

const usersRouter = router({
  // Liste tous les utilisateurs
  list: requirePermission("users.read").query(async () => {
    return await db.getAllUsers();
  }),
  
  // Récupère un utilisateur par ID avec ses rôles
  getById: requirePermission("users.read").input(
    z.object({ id: z.number() })
  ).query(async ({ input }) => {
    return await db.getUserWithRoles(input.id);
  }),
  
  // Assigne un rôle à un utilisateur
  assignRole: requirePermission("users.update").input(
    z.object({
      userId: z.number(),
      roleId: z.number(),
    })
  ).mutation(async ({ input }) => {
    await db.assignRoleToUser(input.userId, input.roleId);
    return { success: true };
  }),
  
  // Retire un rôle à un utilisateur
  removeRole: requirePermission("users.update").input(
    z.object({
      userId: z.number(),
      roleId: z.number(),
    })
  ).mutation(async ({ input }) => {
    await db.removeRoleFromUser(input.userId, input.roleId);
    return { success: true };
  }),
});

// ============================================
// ROUTER RÔLES
// ============================================

const rolesRouter = router({
  // Liste tous les rôles
  list: protectedProcedure.query(async () => {
    return await db.getAllRoles();
  }),
  
  // Récupère un rôle par ID avec ses permissions
  getById: protectedProcedure.input(
    z.object({ id: z.number() })
  ).query(async ({ input }) => {
    return await db.getRoleWithPermissions(input.id);
  }),
});

// ============================================
// ROUTER PERMISSIONS
// ============================================

const permissionsRouter = router({
  // Liste toutes les permissions
  list: protectedProcedure.query(async () => {
    return await db.getAllPermissions();
  }),
  
  // Vérifie si l'utilisateur actuel a une permission
  check: protectedProcedure.input(
    z.object({ permission: z.string() })
  ).query(async ({ ctx, input }) => {
    const hasPermission = await db.checkUserPermission(ctx.user.id, input.permission);
    return { hasPermission };
  }),
});

// ============================================
// ROUTER POSTS
// ============================================

const postsRouter = router({
  // Liste tous les posts
  list: publicProcedure.query(async () => {
    return await db.getAllPosts();
  }),
  
  // Récupère un post par ID
  getById: publicProcedure.input(
    z.object({ id: z.number() })
  ).query(async ({ input }) => {
    return await db.getPostById(input.id);
  }),
  
  // Récupère un post par slug
  getBySlug: publicProcedure.input(
    z.object({ slug: z.string() })
  ).query(async ({ input }) => {
    return await db.getPostBySlug(input.slug);
  }),
  
  // Crée un nouveau post
  create: requirePermission("posts.create").input(
    z.object({
      title: z.string(),
      slug: z.string(),
      content: z.string(),
      excerpt: z.string().optional(),
      status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
  ).mutation(async ({ ctx, input }) => {
    const result = await db.createPost({
      ...input,
      authorId: ctx.user.id,
      publishedAt: input.status === "PUBLISHED" ? new Date() : undefined,
    });
    return { success: true, id: result?.insertId };
  }),
  
  // Met à jour un post
  update: requirePermission("posts.update").input(
    z.object({
      id: z.number(),
      title: z.string().optional(),
      slug: z.string().optional(),
      content: z.string().optional(),
      excerpt: z.string().optional(),
      status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
  ).mutation(async ({ input }) => {
    const { id, ...data } = input;
    await db.updatePost(id, data);
    return { success: true };
  }),
  
  // Supprime un post (soft delete)
  delete: requirePermission("posts.delete").input(
    z.object({ id: z.number() })
  ).mutation(async ({ input }) => {
    await db.deletePost(input.id);
    return { success: true };
  }),
});

// ============================================
// ROUTER CATÉGORIES
// ============================================

const categoriesRouter = router({
  // Liste toutes les catégories
  list: publicProcedure.query(async () => {
    return await db.getAllCategories();
  }),
  
  // Récupère une catégorie par ID
  getById: publicProcedure.input(
    z.object({ id: z.number() })
  ).query(async ({ input }) => {
    return await db.getCategoryById(input.id);
  }),
});

// ============================================
// ROUTER TAGS
// ============================================

const tagsRouter = router({
  // Liste tous les tags
  list: publicProcedure.query(async () => {
    return await db.getAllTags();
  }),
  
  // Récupère un tag par ID
  getById: publicProcedure.input(
    z.object({ id: z.number() })
  ).query(async ({ input }) => {
    return await db.getTagById(input.id);
  }),
});

// ============================================
// ROUTER PRODUITS
// ============================================

const productsRouter = router({
  // Liste tous les produits
  list: publicProcedure.query(async () => {
    return await db.getAllProducts();
  }),
  
  // Récupère un produit par ID
  getById: publicProcedure.input(
    z.object({ id: z.number() })
  ).query(async ({ input }) => {
    return await db.getProductById(input.id);
  }),
});

// ============================================
// ROUTER MÉDIAS
// ============================================

const mediaRouter = router({
  // Liste tous les médias
  list: requirePermission("posts.read").query(async () => {
    return await db.getAllMedia();
  }),
  
  // Récupère un média par ID
  getById: publicProcedure.input(
    z.object({ id: z.number() })
  ).query(async ({ input }) => {
    return await db.getMediaById(input.id);
  }),
});

// ============================================
// ROUTER PRINCIPAL
// ============================================

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  
  // Routers de fonctionnalités
  users: usersRouter,
  roles: rolesRouter,
  permissions: permissionsRouter,
  posts: postsRouter,
  categories: categoriesRouter,
  tags: tagsRouter,
  products: productsRouter,
  media: mediaRouter,
});

export type AppRouter = typeof appRouter;

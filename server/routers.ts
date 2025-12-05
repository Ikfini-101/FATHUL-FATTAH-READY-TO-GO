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
  // Liste tous les utilisateurs avec recherche et pagination
  list: requirePermission("users.read")
    .input(z.object({
      search: z.string().optional(),
      role: z.enum(["admin", "user"]).optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
    }).optional())
    .query(async ({ input }) => {
      const { search, role, page = 1, limit = 10 } = input || {};
      const offset = (page - 1) * limit;
      
      return await db.getUsersWithFilters({
        search,
        role,
        limit,
        offset,
      });
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
  list: publicProcedure
      .input(
        z
          .object({
            search: z.string().optional(),
            status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
            categoryId: z.number().optional(),
            page: z.number().min(1).default(1),
            limit: z.number().min(1).max(100).default(10),
          })
          .optional()
      )
      .query(async ({ input }) => {
        if (!input) {
          const posts = await db.getAllPosts();
          return {
            posts,
            total: posts.length,
            page: 1,
            totalPages: 1,
          };
        }
        return await db.getPostsWithFilters(input);
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
  
  // Crée une catégorie
  create: requirePermission("posts.create").input(
    z.object({
      name: z.string(),
      slug: z.string(),
      description: z.string().optional(),
    })
  ).mutation(async ({ input }) => {
    return await db.createCategory(input);
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
  list: publicProcedure
      .input(
        z
          .object({
            search: z.string().optional(),
            status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]).optional(),
            page: z.number().min(1).default(1),
            limit: z.number().min(1).max(100).default(10),
          })
          .optional()
      )
      .query(async ({ input }) => {
        if (!input) {
          const products = await db.getAllProducts();
          return {
            products,
            total: products.length,
            page: 1,
            totalPages: 1,
          };
        }
        return await db.getProductsWithFilters(input);
      }),
  
  // Récupère un produit par ID
  getById: publicProcedure.input(
    z.object({ id: z.number() })
  ).query(async ({ input }) => {
    return await db.getProductById(input.id);
  }),
  
  // Crée un nouveau produit
  create: requirePermission("products.create").input(
    z.object({
      name: z.string(),
      slug: z.string(),
      description: z.string().optional(),
      price: z.number(),
      stock: z.number(),
      sku: z.string().optional(),
      images: z.string().optional(),
      status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]),
    })
  ).mutation(async ({ input }) => {
    return await db.createProduct(input);
  }),
  
  // Met à jour un produit
  update: requirePermission("products.update").input(
    z.object({
      id: z.number(),
      name: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(),
      price: z.number().optional(),
      stock: z.number().optional(),
      sku: z.string().optional(),
      images: z.string().optional(),
      status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]).optional(),
    })
  ).mutation(async ({ input }) => {
    return await db.updateProduct(input);
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
  
  // Upload d'un fichier vers S3
  upload: protectedProcedure
    .input(z.object({
      fileName: z.string(),
      fileData: z.string(), // Base64
      contentType: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { fileName, fileData, contentType } = input;
      
      // Décoder le base64
      const buffer = Buffer.from(fileData, 'base64');
      
      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(7);
      const fileExtension = fileName.split('.').pop();
      const uniqueFileName = `${timestamp}-${randomSuffix}.${fileExtension}`;
      const fileKey = `uploads/${ctx.user.id}/${uniqueFileName}`;
      
      // Upload vers S3
      const { storagePut } = await import('./storage');
      const result = await storagePut(fileKey, buffer, contentType);
      
      // Enregistrer dans la base de données
      const mediaRecord = await db.createMedia({
        url: result.url,
        filename: uniqueFileName,
        originalName: fileName,
        mimeType: contentType,
        size: buffer.length,
        uploadedBy: ctx.user.id,
      });
      
      if (!mediaRecord) {
        throw new Error('Failed to create media record');
      }
      
      return {
        id: mediaRecord.id,
        url: result.url,
        filename: fileName,
      };
    }),
  
  // Supprime un fichier média
  delete: requirePermission("posts.delete").input(
    z.object({ id: z.number() })
  ).mutation(async ({ input }) => {
    return await db.deleteMedia(input.id);
  }),
});

// ============================================
// ROUTER MESSAGERIE
// ============================================

const messagingRouter = router({
  // Liste les conversations de l'utilisateur
  conversations: protectedProcedure.query(async ({ ctx }) => {
    return await db.getUserConversations(ctx.user.id);
  }),
  
  // Récupère les messages d'une conversation
  messages: protectedProcedure.input(
    z.object({ conversationId: z.number() })
  ).query(async ({ ctx, input }) => {
    return await db.getConversationMessages(input.conversationId, ctx.user.id);
  }),
  
  // Crée ou récupère une conversation directe avec un utilisateur
  createOrGetDirectConversation: protectedProcedure.input(
    z.object({ otherUserId: z.number() })
  ).mutation(async ({ ctx, input }) => {
    return await db.createOrGetDirectConversation(ctx.user.id, input.otherUserId);
  }),
  
  // Envoie un message
  sendMessage: protectedProcedure.input(
    z.object({
      conversationId: z.number(),
      content: z.string(),
      type: z.enum(["TEXT", "IMAGE", "FILE"]).optional(),
      attachmentUrl: z.string().optional(),
    })
  ).mutation(async ({ ctx, input }) => {
    return await db.sendMessage({
      conversationId: input.conversationId,
      senderId: ctx.user.id,
      content: input.content,
      type: input.type,
      attachmentUrl: input.attachmentUrl,
    });
  }),
  
  // Marque une conversation comme lue
  markAsRead: protectedProcedure.input(
    z.object({ conversationId: z.number() })
  ).mutation(async ({ ctx, input }) => {
    return await db.markConversationAsRead(input.conversationId, ctx.user.id);
  }),
});

// ============================================
// ROUTER E-RADIO
// ============================================

const radioShowsRouter = router({
  // Liste toutes les émissions radio
  list: publicProcedure.query(async () => {
    return await db.getAllRadioShows();
  }),
  
  // Récupère une émission par ID
  getById: publicProcedure.input(
    z.object({ id: z.number() })
  ).query(async ({ input }) => {
    return await db.getRadioShowById(input.id);
  }),
  
  // Crée une nouvelle émission radio
  create: requirePermission("posts.create").input(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      hostName: z.string(),
      schedule: z.string().optional(),
      duration: z.number().optional(),
      coverImage: z.string().optional(),
      status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).default("ACTIVE"),
    })
  ).mutation(async ({ input }) => {
    return await db.createRadioShow(input);
  }),
  
  // Met à jour une émission radio
  update: requirePermission("posts.update").input(
    z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      hostName: z.string().optional(),
      schedule: z.string().optional(),
      duration: z.number().optional(),
      coverImage: z.string().optional(),
      status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
    })
  ).mutation(async ({ input }) => {
    const { id, ...data } = input;
    return await db.updateRadioShow(id, data);
  }),
  
  // Supprime une émission radio
  delete: requirePermission("posts.delete").input(
    z.object({ id: z.number() })
  ).mutation(async ({ input }) => {
    return await db.deleteRadioShow(input.id);
  }),
});

// ============================================
// ROUTER MUSÉE VR
// ============================================

const vrExhibitionsRouter = router({
  // Liste toutes les expositions VR
  list: publicProcedure.query(async () => {
    return await db.getAllVRExhibitions();
  }),
  
  // Récupère une exposition par ID
  getById: publicProcedure.input(
    z.object({ id: z.number() })
  ).query(async ({ input }) => {
    return await db.getVRExhibitionById(input.id);
  }),
  
  // Crée une nouvelle exposition VR
  create: requirePermission("posts.create").input(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      coverImage: z.string().optional(),
      vrModelUrl: z.string().optional(),
      status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).default("ACTIVE"),
    })
  ).mutation(async ({ input }) => {
    return await db.createVRExhibition(input);
  }),
  
  // Met à jour une exposition VR
  update: requirePermission("posts.update").input(
    z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      coverImage: z.string().optional(),
      vrModelUrl: z.string().optional(),
      status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
    })
  ).mutation(async ({ input }) => {
    const { id, ...data } = input;
    return await db.updateVRExhibition(id, data);
  }),
  
  // Supprime une exposition VR
  delete: requirePermission("posts.delete").input(
    z.object({ id: z.number() })
  ).mutation(async ({ input }) => {
    return await db.deleteVRExhibition(input.id);
  }),
  
  // Liste tous les artefacts d'une exposition
  artifacts: publicProcedure.input(
    z.object({ exhibitionId: z.number() })
  ).query(async ({ input }) => {
    return await db.getVRExhibitionArtifacts(input.exhibitionId);
  }),
  
  // Crée un nouvel artefact VR
  createArtifact: requirePermission("posts.create").input(
    z.object({
      exhibitionId: z.number(),
      name: z.string(),
      description: z.string().optional(),
      imageUrl: z.string().optional(),
      modelUrl: z.string().optional(),
      audioGuideUrl: z.string().optional(),
    })
  ).mutation(async ({ input }) => {
    return await db.createVRArtifact(input);
  }),
  
  // Met à jour un artefact VR
  updateArtifact: requirePermission("posts.update").input(
    z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      imageUrl: z.string().optional(),
      modelUrl: z.string().optional(),
      audioGuideUrl: z.string().optional(),
    })
  ).mutation(async ({ input }) => {
    const { id, ...data } = input;
    return await db.updateVRArtifact(id, data);
  }),
  
  // Supprime un artefact VR
  deleteArtifact: requirePermission("posts.delete").input(
    z.object({ id: z.number() })
  ).mutation(async ({ input }) => {
    return await db.deleteVRArtifact(input.id);
  }),
});

// ============================================
// ROUTER PORTAL (PAGES PUBLIQUES)
// ============================================

const portalRouter = router({
  // Liste des articles publiés pour le portail public
  articles: publicProcedure.query(async () => {
    return await db.getPublishedPosts();
  }),
  
  // Détail d'un article par slug
  articleBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const article = await db.getPostBySlug(input.slug);
      if (!article) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article non trouvé",
        });
      }
      return article;
    }),
  
  // Liste des événements publiés (futurs et en cours)
  events: publicProcedure.query(async () => {
    return await db.getPublishedEvents();
  }),
  
  // Détail d'un événement par slug
  eventBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const event = await db.getEventBySlug(input.slug);
      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Événement non trouvé",
        });
      }
      return event;
    }),
  
  // Liste des pages statiques publiées
  pages: publicProcedure.query(async () => {
    return await db.getPublishedPages();
  }),
  
  // Détail d'une page par slug
  pageBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const page = await db.getPageBySlug(input.slug);
      if (!page) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Page non trouvée",
        });
      }
      return page;
    }),
  
  // Envoyer un message de contact (avec antispam basique)
  contact: publicProcedure
    .input(z.object({
      name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
      email: z.string().email("Email invalide"),
      subject: z.string().min(3, "Le sujet doit contenir au moins 3 caractères").optional(),
      message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
    }))
    .mutation(async ({ input, ctx }) => {
      // Récupérer IP et User-Agent pour antispam
      const ip = ctx.req.ip || ctx.req.headers['x-forwarded-for'] || 'unknown';
      const userAgent = ctx.req.headers['user-agent'] || 'unknown';
      
      await db.createContactMessage({
        ...input,
        ip: typeof ip === 'string' ? ip : ip[0],
        userAgent,
      });
      
      return { success: true };
    }),
  
  // Recherche unifiée dans le portail
  search: publicProcedure
    .input(z.object({
      query: z.string().min(2, "La recherche doit contenir au moins 2 caractères"),
      lang: z.enum(['fr', 'ar', 'en']).optional().default('fr'),
    }))
    .query(async ({ input }) => {
      return await db.searchPortalContent(input.query, input.lang);
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
  messaging: messagingRouter,
  radioShows: radioShowsRouter,
  vrExhibitions: vrExhibitionsRouter,
  portal: portalRouter,
});

export type AppRouter = typeof appRouter;

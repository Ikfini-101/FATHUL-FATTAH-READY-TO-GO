import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import * as db from "./db";

/**
 * Middleware pour vérifier qu'un utilisateur a une permission spécifique
 * Réutilise les permissions posts.* pour simplifier
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
// CENTRE DE DOCUMENTATION - ADMIN
// ============================================

export const docItemsRouter = router({
  list: requirePermission("posts.read")
    .query(async () => {
      return await db.getAllDocItems();
    }),
  
  getById: requirePermission("posts.read")
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.getDocItemById(input.id);
    }),
  
  create: requirePermission("posts.create")
    .input(z.object({
      slug: z.string(),
      titleI18n: z.object({ fr: z.string().optional(), ar: z.string().optional(), en: z.string().optional() }),
      descriptionI18n: z.object({ fr: z.string().optional(), ar: z.string().optional(), en: z.string().optional() }),
      creator: z.string().optional(),
      contributors: z.array(z.string()).optional(),
      subject: z.array(z.string()).optional(),
      date: z.string().optional(),
      type: z.enum(["manuscript", "book", "article", "thesis", "report", "audio", "video", "image", "other"]),
      language: z.string(),
      rights: z.string().optional(),
      collection: z.string().optional(),
      identifiers: z.object({
        isbn: z.string().optional(),
        issn: z.string().optional(),
        doi: z.string().optional(),
        custom: z.string().optional(),
      }).optional(),
      status: z.enum(["draft", "published", "archived"]).default("draft"),
    }))
    .mutation(async ({ input }) => {
      const id = await db.createDocItem(input);
      return { success: true, id };
    }),
  
  update: requirePermission("posts.update")
    .input(z.object({
      id: z.number(),
      data: z.object({
        slug: z.string().optional(),
        titleI18n: z.object({ fr: z.string().optional(), ar: z.string().optional(), en: z.string().optional() }).optional(),
        descriptionI18n: z.object({ fr: z.string().optional(), ar: z.string().optional(), en: z.string().optional() }).optional(),
        creator: z.string().optional(),
        type: z.enum(["manuscript", "book", "article", "thesis", "report", "audio", "video", "image", "other"]).optional(),
        language: z.string().optional(),
        status: z.enum(["draft", "published", "archived"]).optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      await db.updateDocItem(input.id, input.data);
      return { success: true };
    }),
  
  delete: requirePermission("posts.delete")
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteDocItem(input.id);
      return { success: true };
    }),
});

export const docCopiesRouter = router({
  listByDoc: requirePermission("posts.read")
    .input(z.object({ docItemId: z.number() }))
    .query(async ({ input }) => {
      return await db.getCopiesByDocId(input.docItemId);
    }),
  
  create: requirePermission("posts.create")
    .input(z.object({
      docItemId: z.number(),
      barcode: z.string(),
      location: z.string().optional(),
      status: z.enum(["available", "loaned", "reserved", "damaged", "lost"]).default("available"),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await db.createCopy(input);
      return { success: true, id };
    }),
  
  update: requirePermission("posts.update")
    .input(z.object({
      id: z.number(),
      data: z.object({
        location: z.string().optional(),
        status: z.enum(["available", "loaned", "reserved", "damaged", "lost"]).optional(),
        notes: z.string().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      await db.updateCopy(input.id, input.data);
      return { success: true };
    }),
});

export const docLoansRouter = router({
  listActive: requirePermission("posts.read")
    .query(async () => {
      return await db.getActiveLoans();
    }),
  
  createByBarcode: requirePermission("posts.create")
    .input(z.object({
      barcode: z.string(),
      borrowerName: z.string(),
      borrowerEmail: z.string().email(),
      borrowerId: z.string().optional(),
      dueAt: z.date(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // Rechercher l'exemplaire par code-barres
      const copy = await db.getCopyByBarcode(input.barcode);
      
      if (!copy) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Aucun exemplaire trouvé avec le code-barres ${input.barcode}`
        });
      }
      
      if (copy.status !== "available") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Cet exemplaire n'est pas disponible (statut: ${copy.status})`
        });
      }
      
      // Créer le prêt
      const id = await db.createLoan({
        copyId: copy.id,
        borrowerName: input.borrowerName,
        borrowerEmail: input.borrowerEmail,
        borrowerId: input.borrowerId,
        dueAt: input.dueAt,
        notes: input.notes,
      });
      
      // Notification au propriétaire
      const { notifyOwner } = await import("./_core/notification");
      await notifyOwner({
        title: "Nouveau prêt enregistré",
        content: `Un prêt a été créé pour ${input.borrowerName} (${input.borrowerEmail}). Code-barres: ${input.barcode}. Date de retour prévue : ${input.dueAt.toLocaleDateString('fr-FR')}.`
      }).catch(err => console.error("Erreur notification prêt:", err));
      
      // TODO: Envoyer email de confirmation à l'emprunteur
      console.log(`[EMAIL] Confirmation prêt envoyée à ${input.borrowerEmail}`);
      
      return { success: true, id, copy };
    }),
  
  create: requirePermission("posts.create")
    .input(z.object({
      copyId: z.number(),
      borrowerName: z.string(),
      borrowerEmail: z.string().email(),
      borrowerId: z.string().optional(),
      dueAt: z.date(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await db.createLoan(input);
      
      // Notification au propriétaire
      const { notifyOwner } = await import("./_core/notification");
      await notifyOwner({
        title: "Nouveau prêt enregistré",
        content: `Un prêt a été créé pour ${input.borrowerName} (${input.borrowerEmail}). Date de retour prévue : ${input.dueAt.toLocaleDateString('fr-FR')}.`
      }).catch(err => console.error("Erreur notification prêt:", err));
      
      // TODO: Envoyer email de confirmation à l'emprunteur
      console.log(`[EMAIL] Confirmation prêt envoyée à ${input.borrowerEmail}`);
      
      return { success: true, id };
    }),
  
  return: requirePermission("posts.update")
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.returnLoan(input.id);
      return { success: true };
    }),
});

export const docReproRouter = router({
  list: requirePermission("posts.read")
    .query(async () => {
      return await db.getAllReproRequests();
    }),
  
  create: publicProcedure
    .input(z.object({
      docItemId: z.number(),
      requesterName: z.string(),
      requesterEmail: z.string().email(),
      purpose: z.string().min(10),
    }))
    .mutation(async ({ input }) => {
      const id = await db.createReproRequest(input);
      
      // Notification au propriétaire
      const { notifyOwner } = await import("./_core/notification");
      await notifyOwner({
        title: "Nouvelle demande de reprographie",
        content: `${input.requesterName} (${input.requesterEmail}) a demandé une reprographie. Motif : ${input.purpose.substring(0, 100)}...`
      }).catch(err => console.error("Erreur notification repro:", err));
      
      // TODO: Envoyer email de confirmation au demandeur
      console.log(`[EMAIL] Confirmation reprographie envoyée à ${input.requesterEmail}`);
      
      return { success: true, id };
    }),
  
  updateStatus: requirePermission("posts.update")
    .input(z.object({
      id: z.number(),
      status: z.enum(["received", "processing", "completed", "delivered", "cancelled"]),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // Récupérer la demande pour avoir l'email
      const request = await db.getReproRequestById(input.id);
      
      await db.updateReproRequest(input.id, { status: input.status, notes: input.notes });
      
      // Notification changement de statut
      if (request) {
        const statusLabels: Record<string, string> = {
          received: "reçue",
          processing: "en traitement",
          completed: "terminée",
          delivered: "livrée",
          cancelled: "annulée"
        };
        
        // TODO: Envoyer email au demandeur
        console.log(`[EMAIL] Notification changement statut (${statusLabels[input.status]}) envoyée à ${request.requesterEmail}`);
      }
      
      return { success: true };
    }),
});

// ============================================
// CENTRE DE DOCUMENTATION - PUBLIC
// ============================================

export const docCatalogRouter = router({
  search: publicProcedure
    .input(z.object({
      query: z.string().optional(),
      creator: z.string().optional(),
      type: z.string().optional(),
      language: z.string().optional(),
      yearFrom: z.number().optional(),
      yearTo: z.number().optional(),
      subject: z.string().optional(),
      limit: z.number().default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      return await db.searchDocItems(input);
    }),
  
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const doc = await db.getDocItemBySlug(input.slug);
      if (!doc || doc.status !== "published") {
        throw new TRPCError({ code: "NOT_FOUND", message: "Document non trouvé" });
      }
      return doc;
    }),
  
  getFiles: publicProcedure
    .input(z.object({ docItemId: z.number() }))
    .query(async ({ input }) => {
      return await db.getFilesByDocId(input.docItemId);
    }),
  
  downloadFile: publicProcedure
    .input(z.object({ fileId: z.number() }))
    .query(async ({ input }) => {
      const file = await db.getFileAssetById(input.fileId);
      
      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Fichier non trouvé" });
      }
      
      // Générer URL signée avec expiration (si le fichier est sur S3)
      // Pour l'instant, retourner l'URL directe
      return {
        url: file.fileUrl,
        filename: file.fileUrl.split('/').pop() || 'document',
        mime: file.mimeType || 'application/octet-stream',
      };
    }),
});

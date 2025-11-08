import { eq, and, or, isNull, sql, desc, asc, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  users, 
  roles, 
  permissions, 
  userRoles, 
  rolePermissions, 
  posts, 
  categories, 
  tags, 
  postCategories, 
  postTags, 
  products, 
  media,
  conversations,
  conversationParticipants,
  messages,
} from "../drizzle/schema";
import type { 
  InsertUser, 
  InsertRole, 
  InsertPermission, 
  InsertPost, 
  InsertCategory, 
  InsertTag, 
  InsertProduct, 
  InsertMedia,
  InsertConversation,
  InsertConversationParticipant,
  InsertMessage,
} from "../drizzle/schema";
import { ENV } from './_core/env';

// Import all tables from schema
import * as schema from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
    
    // Assigner automatiquement le rôle admin au propriétaire
    if (user.openId === ENV.ownerOpenId) {
      await ensureOwnerHasAdminRole(user.openId);
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

/**
 * Assure que le propriétaire du projet a le rôle admin avec toutes les permissions
 */
async function ensureOwnerHasAdminRole(openId: string) {
  const db = await getDb();
  if (!db) return;

  try {
    // Récupérer l'utilisateur
    const [user] = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
    if (!user) return;

    // Récupérer le rôle admin
    const [adminRole] = await db.select().from(roles).where(eq(roles.name, "admin")).limit(1);
    if (!adminRole) {
      console.warn("[Database] Admin role not found, please run seed script");
      return;
    }

    // Vérifier si l'utilisateur a déjà le rôle admin
    const existingUserRole = await db
      .select()
      .from(userRoles)
      .where(and(eq(userRoles.userId, user.id), eq(userRoles.roleId, adminRole.id)))
      .limit(1);

    if (existingUserRole.length === 0) {
      // Assigner le rôle admin
      await db.insert(userRoles).values({
        userId: user.id,
        roleId: adminRole.id,
      });
      console.log(`[Database] Admin role assigned to owner: ${user.email}`);
    }
  } catch (error) {
    console.error("[Database] Failed to ensure owner has admin role:", error);
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================
// FONCTIONS DE GESTION DES UTILISATEURS
// ============================================

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).where(isNull(users.deletedAt));
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserWithRoles(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const user = await getUserById(userId);
  if (!user) return undefined;
  
  const userRolesList = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.userId, userId));
  
  const roleIds = userRolesList.map(ur => ur.roleId);
  const userRoleDetails = roleIds.length > 0 
    ? await db.select().from(roles).where(inArray(roles.id, roleIds))
    : [];
  
  return {
    ...user,
    roles: userRoleDetails,
  };
}

// ============================================
// FONCTIONS DE GESTION DES RÔLES
// ============================================

export async function getAllRoles() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(roles);
}

export async function getRoleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(roles).where(eq(roles.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getRoleByName(name: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(roles).where(eq(roles.name, name)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getRoleWithPermissions(roleId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const role = await getRoleById(roleId);
  if (!role) return undefined;
  
  const rolePermissionsList = await db
    .select()
    .from(rolePermissions)
    .where(eq(rolePermissions.roleId, roleId));
  
  const permissionIds = rolePermissionsList.map(rp => rp.permissionId);
  const permissionDetails = permissionIds.length > 0
    ? await db.select().from(permissions).where(inArray(permissions.id, permissionIds))
    : [];
  
  return {
    ...role,
    permissions: permissionDetails,
  };
}

export async function assignRoleToUser(userId: number, roleId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(userRoles).values({ userId, roleId }).onDuplicateKeyUpdate({ set: { userId } });
}

export async function removeRoleFromUser(userId: number, roleId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(userRoles).where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)));
}

// ============================================
// FONCTIONS DE GESTION DES PERMISSIONS
// ============================================

export async function getAllPermissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(permissions);
}

export async function getPermissionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(permissions).where(eq(permissions.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function checkUserPermission(userId: number, permissionName: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  // Récupérer les rôles de l'utilisateur
  const userRolesList = await db.select().from(userRoles).where(eq(userRoles.userId, userId));
  const roleIds = userRolesList.map(ur => ur.roleId);
  
  if (roleIds.length === 0) return false;
  
  // Récupérer les permissions de ces rôles
  const rolePermissionsList = await db
    .select()
    .from(rolePermissions)
    .where(inArray(rolePermissions.roleId, roleIds));
  
  const permissionIds = rolePermissionsList.map(rp => rp.permissionId);
  
  if (permissionIds.length === 0) return false;
  
  // Vérifier si la permission existe
  const permission = await db
    .select()
    .from(permissions)
    .where(and(
      inArray(permissions.id, permissionIds),
      eq(permissions.name, permissionName)
    ))
    .limit(1);
  
  return permission.length > 0;
}

// ============================================
// FONCTIONS DE GESTION DES POSTS
// ============================================

export async function getAllPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).where(isNull(posts.deletedAt));
}

export async function getPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createPost(post: InsertPost) {
  const db = await getDb();
  if (!db) return undefined;
  const [result] = await db.insert(posts).values(post);
  return result;
}

export async function updatePost(id: number, post: Partial<InsertPost>) {
  const db = await getDb();
  if (!db) return;
  await db.update(posts).set(post).where(eq(posts.id, id));
}

export async function deletePost(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(posts).set({ deletedAt: new Date() }).where(eq(posts.id, id));
}

// ============================================
// FONCTIONS DE GESTION DES CATÉGORIES
// ============================================

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories);
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================
// FONCTIONS DE GESTION DES TAGS
// ============================================

export async function getAllTags() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tags);
}

export async function getTagById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tags).where(eq(tags.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================
// FONCTIONS DE GESTION DES PRODUITS
// ============================================

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(isNull(products.deletedAt));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) return undefined;
  const [result] = await db.insert(products).values(product);
  return result;
}

export async function updateProduct(data: { id: number } & Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) return;
  const { id, ...updateData } = data;
  await db.update(products).set(updateData).where(eq(products.id, id));
}

// ============================================
// FONCTIONS DE GESTION DES MÉDIAS
// ============================================

export async function getAllMedia() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(media).where(isNull(media.deletedAt));
}

export async function getMediaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(media).where(eq(media.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================
// FONCTIONS DE GESTION DE LA MESSAGERIE
// ============================================

export async function getUserConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Créer des alias pour éviter les conflits
  const cp1 = alias(conversationParticipants, 'cp1');
  const cp2 = alias(conversationParticipants, 'cp2');
  
  // Récupérer les conversations où l'utilisateur est participant
  const result = await db
    .select({
      conversation: conversations,
      lastMessage: messages,
      otherParticipant: users,
    })
    .from(cp1)
    .innerJoin(conversations, eq(cp1.conversationId, conversations.id))
    .leftJoin(
      messages,
      and(
        eq(messages.conversationId, conversations.id),
        isNull(messages.deletedAt)
      )
    )
    .leftJoin(
      cp2,
      and(
        eq(cp2.conversationId, conversations.id),
        sql`${cp2.userId} != ${userId}`
      )
    )
    .leftJoin(users, eq(users.id, cp2.userId))
    .where(eq(cp1.userId, userId))
    .orderBy(desc(conversations.updatedAt), desc(messages.createdAt));
  
  // Grouper les résultats pour éviter les doublons (une conversation par ligne)
  const grouped = result.reduce((acc: any[], row) => {
    const existingConv = acc.find(c => c.conversation.id === row.conversation.id);
    
    if (!existingConv) {
      acc.push(row);
    } else if (row.lastMessage && (!existingConv.lastMessage || 
               new Date(row.lastMessage.createdAt) > new Date(existingConv.lastMessage.createdAt))) {
      // Remplacer par le message le plus récent
      existingConv.lastMessage = row.lastMessage;
    }
    
    return acc;
  }, []);
  
  return grouped;
}

export async function getConversationMessages(conversationId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Vérifier que l'utilisateur est participant
  const isParticipant = await db
    .select()
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId)
      )
    )
    .limit(1);
  
  if (isParticipant.length === 0) {
    throw new Error("Vous n'êtes pas participant de cette conversation");
  }
  
  // Récupérer les messages avec les informations de l'expéditeur
  const result = await db
    .select({
      message: messages,
      sender: users,
    })
    .from(messages)
    .innerJoin(users, eq(messages.senderId, users.id))
    .where(
      and(
        eq(messages.conversationId, conversationId),
        isNull(messages.deletedAt)
      )
    )
    .orderBy(asc(messages.createdAt));
  
  return result;
}

export async function createOrGetDirectConversation(userId1: number, userId2: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  // Chercher une conversation directe existante entre ces deux utilisateurs
  const existing = await db
    .select({ conversationId: conversationParticipants.conversationId })
    .from(conversationParticipants)
    .innerJoin(conversations, eq(conversationParticipants.conversationId, conversations.id))
    .where(
      and(
        eq(conversations.type, "DIRECT"),
        sql`${conversationParticipants.conversationId} IN (
          SELECT conversationId FROM conversationParticipants WHERE userId = ${userId1}
        )`,
        sql`${conversationParticipants.conversationId} IN (
          SELECT conversationId FROM conversationParticipants WHERE userId = ${userId2}
        )`
      )
    )
    .limit(1);
  
  if (existing.length > 0) {
    return existing[0].conversationId;
  }
  
  // Créer une nouvelle conversation
  const [conversation] = await db.insert(conversations).values({
    type: "DIRECT",
  });
  
  const conversationId = conversation.insertId;
  
  // Ajouter les deux participants
  await db.insert(conversationParticipants).values([
    { conversationId, userId: userId1 },
    { conversationId, userId: userId2 },
  ]);
  
  return conversationId;
}

export async function sendMessage(data: {
  conversationId: number;
  senderId: number;
  content: string;
  type?: "TEXT" | "IMAGE" | "FILE";
  attachmentUrl?: string;
}) {
  const db = await getDb();
  if (!db) return undefined;
  
  // Vérifier que l'expéditeur est participant
  const isParticipant = await db
    .select()
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, data.conversationId),
        eq(conversationParticipants.userId, data.senderId)
      )
    )
    .limit(1);
  
  if (isParticipant.length === 0) {
    throw new Error("Vous n'êtes pas participant de cette conversation");
  }
  
  // Créer le message
  const [message] = await db.insert(messages).values({
    conversationId: data.conversationId,
    senderId: data.senderId,
    content: data.content,
    type: data.type || "TEXT",
    attachmentUrl: data.attachmentUrl,
  });
  
  // Mettre à jour la date de mise à jour de la conversation
  await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, data.conversationId));
  
  return message;
}

export async function markConversationAsRead(conversationId: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db
    .update(conversationParticipants)
    .set({ lastReadAt: new Date() })
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId)
      )
    );
}

export async function createMedia(data: InsertMedia) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(media).values(data);
  return await getMediaById(Number(result[0].insertId));
}

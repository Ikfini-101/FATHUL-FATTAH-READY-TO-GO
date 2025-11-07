import { eq, and, sql, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema";
import { users, roles, permissions, userRoles, rolePermissions, posts, categories, tags, postCategories, postTags, products, media } from "../drizzle/schema";
import type { InsertUser, InsertRole, InsertPermission, InsertPost, InsertCategory, InsertTag, InsertProduct, InsertMedia } from "../drizzle/schema";
import { ENV } from './_core/env';

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
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
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
    ? await db.select().from(roles).where(sql`${roles.id} IN (${sql.join(roleIds.map(id => sql`${id}`), sql`, `)})`)
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
    ? await db.select().from(permissions).where(sql`${permissions.id} IN (${sql.join(permissionIds.map(id => sql`${id}`), sql`, `)})`)
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
    .where(sql`${rolePermissions.roleId} IN (${sql.join(roleIds.map(id => sql`${id}`), sql`, `)})`);
  
  const permissionIds = rolePermissionsList.map(rp => rp.permissionId);
  
  if (permissionIds.length === 0) return false;
  
  // Vérifier si la permission existe
  const permission = await db
    .select()
    .from(permissions)
    .where(and(
      sql`${permissions.id} IN (${sql.join(permissionIds.map(id => sql`${id}`), sql`, `)})`,
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

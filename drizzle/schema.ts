import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Schéma de base de données pour l'écosystème Fathul Fattah
 * Adapté du schéma Prisma pour fonctionner avec Drizzle ORM et MySQL
 */

// ============================================
// AUTHENTIFICATION ET UTILISATEURS
// ============================================

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  email: varchar("email", { length: 320 }).unique(),
  emailVerified: timestamp("emailVerified"),
  name: text("name"),
  image: text("image"),
  password: text("password"), // Hash bcrypt
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  deletedAt: timestamp("deletedAt"),
});

export const accounts = mysqlTable("accounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 64 }).notNull(),
  provider: varchar("provider", { length: 64 }).notNull(),
  providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
  refreshToken: text("refreshToken"),
  accessToken: text("accessToken"),
  expiresAt: int("expiresAt"),
  tokenType: varchar("tokenType", { length: 64 }),
  scope: text("scope"),
  idToken: text("idToken"),
  sessionState: text("sessionState"),
});

export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().unique(),
  userId: int("userId").notNull(),
  expires: timestamp("expires").notNull(),
});

export const verificationTokens = mysqlTable("verificationTokens", {
  id: int("id").autoincrement().primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expires: timestamp("expires").notNull(),
});

// ============================================
// RÔLES ET PERMISSIONS
// ============================================

export const roles = mysqlTable("roles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 64 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const userRoles = mysqlTable("userRoles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  roleId: int("roleId").notNull(),
  assignedAt: timestamp("assignedAt").defaultNow().notNull(),
});

export const permissions = mysqlTable("permissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull().unique(),
  description: text("description"),
  resource: varchar("resource", { length: 64 }).notNull(),
  action: varchar("action", { length: 32 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const rolePermissions = mysqlTable("rolePermissions", {
  id: int("id").autoincrement().primaryKey(),
  roleId: int("roleId").notNull(),
  permissionId: int("permissionId").notNull(),
  grantedAt: timestamp("grantedAt").defaultNow().notNull(),
});

// ============================================
// CONTENU
// ============================================

export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  authorId: int("authorId").notNull(),
  status: mysqlEnum("status", ["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT").notNull(),
  publishedAt: timestamp("publishedAt"),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp("deletedAt"),
});

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull().unique(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const postCategories = mysqlTable("postCategories", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  categoryId: int("categoryId").notNull(),
});

export const tags = mysqlTable("tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 64 }).notNull().unique(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const postTags = mysqlTable("postTags", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  tagId: int("tagId").notNull(),
});

// ============================================
// MÉDIAS
// ============================================

export const media = mysqlTable("media", {
  id: int("id").autoincrement().primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("originalName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 128 }).notNull(),
  size: int("size").notNull(),
  url: text("url").notNull(),
  uploadedBy: int("uploadedBy").notNull(),
  alt: text("alt"),
  caption: text("caption"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  deletedAt: timestamp("deletedAt"),
});

// ============================================
// E-BOUTIQUE
// ============================================

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: int("price").notNull(), // Prix en centimes
  stock: int("stock").default(0).notNull(),
  images: json("images"), // Array d'URLs
  status: mysqlEnum("status", ["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]).default("ACTIVE").notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp("deletedAt"),
});

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 64 }).notNull().unique(),
  userId: int("userId").notNull(),
  subtotal: int("subtotal").notNull(), // En centimes
  tax: int("tax").notNull(),
  total: int("total").notNull(),
  status: mysqlEnum("status", ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).default("PENDING").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").notNull(),
  price: int("price").notNull(), // Prix en centimes
});

// ============================================
// E-RADIO
// ============================================

export const radioShows = mysqlTable("radioShows", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  schedule: varchar("schedule", { length: 255 }),
  duration: int("duration"),
  hostName: varchar("hostName", { length: 128 }),
  coverImage: text("coverImage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const radioEpisodes = mysqlTable("radioEpisodes", {
  id: int("id").autoincrement().primaryKey(),
  showId: int("showId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  audioUrl: text("audioUrl").notNull(),
  duration: int("duration").notNull(),
  publishedAt: timestamp("publishedAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ============================================
// MESSAGERIE
// ============================================

export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }), // Nom de la conversation (pour les groupes)
  type: mysqlEnum("type", ["DIRECT", "GROUP"]).default("DIRECT").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const conversationParticipants = mysqlTable("conversationParticipants", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  userId: int("userId").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  lastReadAt: timestamp("lastReadAt"),
});

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  senderId: int("senderId").notNull(),
  content: text("content").notNull(),
  type: mysqlEnum("type", ["TEXT", "IMAGE", "FILE"]).default("TEXT").notNull(),
  attachmentUrl: varchar("attachmentUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp("deletedAt"),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;
export type ConversationParticipant = typeof conversationParticipants.$inferSelect;
export type InsertConversationParticipant = typeof conversationParticipants.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// ============================================
// MUSÉE VR
// ============================================

export const vrExhibitions = mysqlTable("vrExhibitions", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  sceneUrl: text("sceneUrl").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const vrArtifacts = mysqlTable("vrArtifacts", {
  id: int("id").autoincrement().primaryKey(),
  exhibitionId: int("exhibitionId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  modelUrl: text("modelUrl").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  positionX: int("positionX"),
  positionY: int("positionY"),
  positionZ: int("positionZ"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ============================================
// LOGS ET AUDIT
// ============================================

export const activityLogs = mysqlTable("activityLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  action: varchar("action", { length: 128 }).notNull(),
  resource: varchar("resource", { length: 64 }).notNull(),
  resourceId: int("resourceId"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ============================================
// TYPES D'EXPORT
// ============================================

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Role = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;

export type Permission = typeof permissions.$inferSelect;
export type InsertPermission = typeof permissions.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

export type Tag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;

export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export type RadioShow = typeof radioShows.$inferSelect;
export type InsertRadioShow = typeof radioShows.$inferInsert;

export type RadioEpisode = typeof radioEpisodes.$inferSelect;
export type InsertRadioEpisode = typeof radioEpisodes.$inferInsert;

export type VRExhibition = typeof vrExhibitions.$inferSelect;
export type InsertVRExhibition = typeof vrExhibitions.$inferInsert;

export type VRArtifact = typeof vrArtifacts.$inferSelect;
export type InsertVRArtifact = typeof vrArtifacts.$inferInsert;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;

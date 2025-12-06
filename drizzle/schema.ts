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
  // Champs i18n pour le Portal multilingue
  titleI18n: json("title_i18n").$type<{fr: string, ar: string, en: string}>(),
  excerptI18n: json("excerpt_i18n").$type<{fr: string, ar: string, en: string}>(),
  bodyI18n: json("body_i18n").$type<{fr: string, ar: string, en: string}>(),
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
  nameI18n: json("name_i18n").$type<{fr: string, ar: string, en: string}>(),
  descriptionI18n: json("description_i18n").$type<{fr: string, ar: string, en: string}>(),
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
  nameI18n: json("name_i18n").$type<{fr: string, ar: string, en: string}>(),
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
  altI18n: json("alt_i18n").$type<{fr: string, ar: string, en: string}>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  deletedAt: timestamp("deletedAt"),
});

// ============================================
// E-BOUTIQUE
// ============================================

export const productCategories = mysqlTable("productCategories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameI18n: json("nameI18n"), // { fr: string, ar: string, en: string }
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  descriptionI18n: json("descriptionI18n"),
  parentId: int("parentId"), // Pour catégories hiérarchiques
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameI18n: json("nameI18n"), // { fr: string, ar: string, en: string }
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  descriptionI18n: json("descriptionI18n"),
  categoryId: int("categoryId"),
  price: int("price").notNull(), // Prix en centimes (FCFA par défaut)
  compareAtPrice: int("compareAtPrice"), // Prix barré pour promos
  stock: int("stock").default(0).notNull(),
  sku: varchar("sku", { length: 128 }), // Code produit
  weight: int("weight"), // Poids en grammes
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
  
  // Informations client
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 32 }),
  
  // Adresse de livraison
  shippingAddress: text("shippingAddress").notNull(),
  shippingCity: varchar("shippingCity", { length: 128 }).notNull(),
  shippingCountry: varchar("shippingCountry", { length: 64 }).notNull(),
  shippingPostalCode: varchar("shippingPostalCode", { length: 32 }),
  
  // Montants
  subtotal: int("subtotal").notNull(), // En centimes
  shippingCost: int("shippingCost").default(0).notNull(),
  tax: int("tax").default(0).notNull(),
  total: int("total").notNull(),
  currency: varchar("currency", { length: 8 }).default("XOF").notNull(), // XOF (FCFA), EUR, USD
  
  // Paiement
  paymentMethod: varchar("paymentMethod", { length: 64 }), // bictorys, wave, orange_money, cash
  paymentStatus: mysqlEnum("paymentStatus", ["PENDING", "PAID", "FAILED", "REFUNDED"]).default("PENDING").notNull(),
  paymentTransactionId: varchar("paymentTransactionId", { length: 255 }),
  paidAt: timestamp("paidAt"),
  
  // Statut commande
  status: mysqlEnum("status", ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).default("PENDING").notNull(),
  notes: text("notes"), // Notes internes
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(), // Snapshot du nom
  quantity: int("quantity").notNull(),
  price: int("price").notNull(), // Prix unitaire en centimes (snapshot)
  subtotal: int("subtotal").notNull(), // quantity * price
});

export const cart = mysqlTable("cart", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Null pour panier anonyme (session)
  sessionId: varchar("sessionId", { length: 255 }), // Pour paniers anonymes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  expiresAt: timestamp("expiresAt"), // Expiration panier anonyme (7 jours)
});

export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  cartId: int("cartId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ============================================
// E-RADIO
// ============================================

export const radioShows = mysqlTable("radioShows", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  titleI18n: json("titleI18n"), // { fr: string, ar: string, en: string }
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  descriptionI18n: json("descriptionI18n"), // { fr: string, ar: string, en: string }
  category: varchar("category", { length: 64 }), // spirituel, culturel, educatif, etc.
  duration: int("duration"), // Durée en minutes
  hostName: varchar("hostName", { length: 128 }),
  coverImage: text("coverImage"),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const radioEpisodes = mysqlTable("radioEpisodes", {
  id: int("id").autoincrement().primaryKey(),
  showId: int("showId").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  titleI18n: json("titleI18n"), // { fr: string, ar: string, en: string }
  description: text("description"),
  descriptionI18n: json("descriptionI18n"), // { fr: string, ar: string, en: string }
  audioUrl: text("audioUrl").notNull(), // URL S3 du fichier audio
  duration: int("duration").notNull(), // Durée en secondes
  fileSize: int("fileSize"), // Taille fichier en bytes
  publishedAt: timestamp("publishedAt").notNull(),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const radioSchedule = mysqlTable("radioSchedule", {
  id: int("id").autoincrement().primaryKey(),
  showId: int("showId").notNull(),
  dayOfWeek: int("dayOfWeek").notNull(), // 0=Dimanche, 1=Lundi, ..., 6=Samedi
  startTime: varchar("startTime", { length: 5 }).notNull(), // Format HH:MM (ex: "14:30")
  endTime: varchar("endTime", { length: 5 }).notNull(), // Format HH:MM
  timezone: varchar("timezone", { length: 64 }).default("Africa/Dakar").notNull(),
  isRecurring: boolean("isRecurring").default(true).notNull(), // Récurrent chaque semaine
  startDate: timestamp("startDate"), // Date de début (optionnel pour émissions spéciales)
  endDate: timestamp("endDate"), // Date de fin (optionnel)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const radioSettings = mysqlTable("radioSettings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 128 }).notNull().unique(), // Clé unique (ex: "live_stream_url", "current_show_title")
  value: text("value"), // Valeur du paramètre
  description: text("description"), // Description du paramètre
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
// PORTAL INSTITUTIONNEL
// ============================================

export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  titleI18n: json("title_i18n").$type<{fr: string, ar: string, en: string}>().notNull(),
  bodyI18n: json("body_i18n").$type<{fr: string, ar: string, en: string}>().notNull(),
  startAt: timestamp("start_at").notNull(),
  endAt: timestamp("end_at").notNull(),
  location: varchar("location", { length: 255 }),
  status: mysqlEnum("status", ["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const pages = mysqlTable("pages", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  titleI18n: json("title_i18n").$type<{fr: string, ar: string, en: string}>().notNull(),
  bodyI18n: json("body_i18n").$type<{fr: string, ar: string, en: string}>().notNull(),
  status: mysqlEnum("status", ["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT").notNull(),
  authorId: int("author_id").notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  ip: varchar("ip", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
  repliedAt: timestamp("replied_at"),
});

export const menus = mysqlTable("menus", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull().unique(),
  items: json("items").$type<Array<{label: {fr: string, ar: string, en: string}, href: string}>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
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

export type ProductCategory = typeof productCategories.$inferSelect;
export type InsertProductCategory = typeof productCategories.$inferInsert;

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

export type Cart = typeof cart.$inferSelect;
export type InsertCart = typeof cart.$inferInsert;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

export type RadioShow = typeof radioShows.$inferSelect;
export type InsertRadioShow = typeof radioShows.$inferInsert;

export type RadioEpisode = typeof radioEpisodes.$inferSelect;
export type InsertRadioEpisode = typeof radioEpisodes.$inferInsert;

export type RadioSchedule = typeof radioSchedule.$inferSelect;
export type InsertRadioSchedule = typeof radioSchedule.$inferInsert;

export type RadioSettings = typeof radioSettings.$inferSelect;
export type InsertRadioSettings = typeof radioSettings.$inferInsert;

export type VRExhibition = typeof vrExhibitions.$inferSelect;
export type InsertVRExhibition = typeof vrExhibitions.$inferInsert;

export type VRArtifact = typeof vrArtifacts.$inferSelect;
export type InsertVRArtifact = typeof vrArtifacts.$inferInsert;

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

export type Page = typeof pages.$inferSelect;
export type InsertPage = typeof pages.$inferInsert;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

export type Menu = typeof menus.$inferSelect;
export type InsertMenu = typeof menus.$inferInsert;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;


// ============================================
// CENTRE DE DOCUMENTATION
// ============================================

export const docItems = mysqlTable("doc_items", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  titleI18n: json("title_i18n").$type<{ fr?: string; ar?: string; en?: string }>(),
  descriptionI18n: json("description_i18n").$type<{ fr?: string; ar?: string; en?: string }>(),
  creator: varchar("creator", { length: 255 }),
  contributors: json("contributors").$type<string[]>(),
  subject: json("subject").$type<string[]>(),
  date: varchar("date", { length: 50 }),
  type: mysqlEnum("type", ["manuscript", "book", "article", "thesis", "report", "audio", "video", "image", "other"]).notNull(),
  language: varchar("language", { length: 10 }).notNull(),
  rights: text("rights"),
  collection: varchar("collection", { length: 255 }),
  identifiers: json("identifiers").$type<{ isbn?: string; issn?: string; doi?: string; custom?: string }>(),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const persons = mysqlTable("persons", {
  id: int("id").autoincrement().primaryKey(),
  nameI18n: json("name_i18n").$type<{ fr?: string; ar?: string; en?: string }>().notNull(),
  birthYear: int("birth_year"),
  deathYear: int("death_year"),
  roles: json("roles").$type<string[]>(),
  biography: json("biography").$type<{ fr?: string; ar?: string; en?: string }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const subjects = mysqlTable("subjects", {
  id: int("id").autoincrement().primaryKey(),
  labelI18n: json("label_i18n").$type<{ fr?: string; ar?: string; en?: string }>().notNull(),
  parentId: int("parent_id"),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const copies = mysqlTable("copies", {
  id: int("id").autoincrement().primaryKey(),
  docItemId: int("doc_item_id").notNull(),
  barcode: varchar("barcode", { length: 100 }).notNull().unique(),
  location: varchar("location", { length: 255 }),
  status: mysqlEnum("status", ["available", "loaned", "reserved", "damaged", "lost"]).default("available").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const loans = mysqlTable("loans", {
  id: int("id").autoincrement().primaryKey(),
  copyId: int("copy_id").notNull(),
  borrowerName: varchar("borrower_name", { length: 255 }).notNull(),
  borrowerEmail: varchar("borrower_email", { length: 320 }).notNull(),
  borrowerId: varchar("borrower_id", { length: 100 }),
  loanedAt: timestamp("loaned_at").defaultNow().notNull(),
  dueAt: timestamp("due_at").notNull(),
  returnedAt: timestamp("returned_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const reproRequests = mysqlTable("repro_requests", {
  id: int("id").autoincrement().primaryKey(),
  docItemId: int("doc_item_id").notNull(),
  requesterName: varchar("requester_name", { length: 255 }).notNull(),
  requesterEmail: varchar("requester_email", { length: 320 }).notNull(),
  purpose: text("purpose").notNull(),
  status: mysqlEnum("status", ["received", "processing", "completed", "delivered", "cancelled"]).default("received").notNull(),
  files: json("files").$type<string[]>(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const fileAssets = mysqlTable("file_assets", {
  id: int("id").autoincrement().primaryKey(),
  docItemId: int("doc_item_id").notNull(),
  fileUrl: varchar("file_url", { length: 512 }).notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(),
  fileSize: int("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  altI18n: json("alt_i18n").$type<{ fr?: string; ar?: string; en?: string }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Types TypeScript
export type DocItem = typeof docItems.$inferSelect;
export type InsertDocItem = typeof docItems.$inferInsert;

export type Person = typeof persons.$inferSelect;
export type InsertPerson = typeof persons.$inferInsert;

export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = typeof subjects.$inferInsert;

export type Copy = typeof copies.$inferSelect;
export type InsertCopy = typeof copies.$inferInsert;

export type Loan = typeof loans.$inferSelect;
export type InsertLoan = typeof loans.$inferInsert;

export type ReproRequest = typeof reproRequests.$inferSelect;
export type InsertReproRequest = typeof reproRequests.$inferInsert;

export type FileAsset = typeof fileAssets.$inferSelect;
export type InsertFileAsset = typeof fileAssets.$inferInsert;

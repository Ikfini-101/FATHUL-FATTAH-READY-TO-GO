/**
 * Script de seed pour initialiser la base de données Fathul Fattah
 * Ce script crée des données de test pour faciliter le développement
 */

import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";
import * as bcrypt from "bcrypt";

const db = drizzle(process.env.DATABASE_URL!, { schema, mode: "default" });

async function main() {
  console.log("🌱 Début du seeding de la base de données...");

  // ============================================
  // 1. CRÉER LES RÔLES
  // ============================================
  console.log("\n📋 Création des rôles...");

  const [adminRole] = await db
    .insert(schema.roles)
    .values({
      name: "admin",
      description: "Administrateur système avec tous les droits",
    })
    .onDuplicateKeyUpdate({ set: { name: "admin" } });

  const [editorRole] = await db
    .insert(schema.roles)
    .values({
      name: "editor",
      description: "Éditeur de contenu",
    })
    .onDuplicateKeyUpdate({ set: { name: "editor" } });

  const [userRole] = await db
    .insert(schema.roles)
    .values({
      name: "user",
      description: "Utilisateur standard",
    })
    .onDuplicateKeyUpdate({ set: { name: "user" } });

  console.log("✅ Rôles créés: admin, editor, user");

  // ============================================
  // 2. CRÉER LES PERMISSIONS
  // ============================================
  console.log("\n🔐 Création des permissions...");

  const permissionsData = [
    // Utilisateurs
    { name: "users.create", resource: "users", action: "create", description: "Créer des utilisateurs" },
    { name: "users.read", resource: "users", action: "read", description: "Voir les utilisateurs" },
    { name: "users.update", resource: "users", action: "update", description: "Modifier les utilisateurs" },
    { name: "users.delete", resource: "users", action: "delete", description: "Supprimer les utilisateurs" },
    
    // Posts
    { name: "posts.create", resource: "posts", action: "create", description: "Créer des articles" },
    { name: "posts.read", resource: "posts", action: "read", description: "Voir les articles" },
    { name: "posts.update", resource: "posts", action: "update", description: "Modifier les articles" },
    { name: "posts.delete", resource: "posts", action: "delete", description: "Supprimer les articles" },
    
    // Produits
    { name: "products.create", resource: "products", action: "create", description: "Créer des produits" },
    { name: "products.read", resource: "products", action: "read", description: "Voir les produits" },
    { name: "products.update", resource: "products", action: "update", description: "Modifier les produits" },
    { name: "products.delete", resource: "products", action: "delete", description: "Supprimer les produits" },
  ];

  for (const perm of permissionsData) {
    await db
      .insert(schema.permissions)
      .values(perm)
      .onDuplicateKeyUpdate({ set: { name: perm.name } });
  }

  console.log("✅ Permissions créées:", permissionsData.length);

  // ============================================
  // 3. RÉCUPÉRER LES IDS DES RÔLES ET PERMISSIONS
  // ============================================
  const roles = await db.select().from(schema.roles);
  const permissions = await db.select().from(schema.permissions);

  const adminRoleId = roles.find((r) => r.name === "admin")!.id;
  const editorRoleId = roles.find((r) => r.name === "editor")!.id;

  // ============================================
  // 4. ASSIGNER LES PERMISSIONS AUX RÔLES
  // ============================================
  console.log("\n🔗 Association des permissions aux rôles...");

  // Admin a toutes les permissions
  for (const perm of permissions) {
    await db
      .insert(schema.rolePermissions)
      .values({
        roleId: adminRoleId,
        permissionId: perm.id,
      })
      .onDuplicateKeyUpdate({ set: { roleId: adminRoleId } });
  }

  // Éditeur a les permissions de lecture et écriture sur les posts
  const editorPermissions = permissions.filter((p) =>
    ["posts.create", "posts.read", "posts.update"].includes(p.name)
  );

  for (const perm of editorPermissions) {
    await db
      .insert(schema.rolePermissions)
      .values({
        roleId: editorRoleId,
        permissionId: perm.id,
      })
      .onDuplicateKeyUpdate({ set: { roleId: editorRoleId } });
  }

  console.log("✅ Permissions assignées aux rôles");

  // ============================================
  // 5. CRÉER UN UTILISATEUR ADMIN
  // ============================================
  console.log("\n👤 Création de l'utilisateur admin...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const [adminUser] = await db
    .insert(schema.users)
    .values({
      openId: "admin-fathul-fattah",
      email: "admin@fathul-fattah.dev",
      name: "Administrateur",
      password: hashedPassword,
      emailVerified: new Date(),
      role: "admin",
    })
    .onDuplicateKeyUpdate({ set: { email: "admin@fathul-fattah.dev" } });

  // Récupérer l'utilisateur créé
  const [adminUserData] = await db
    .select()
    .from(schema.users)
    .where((users) => users.openId === "admin-fathul-fattah")
    .limit(1);

  // Assigner le rôle admin
  await db
    .insert(schema.userRoles)
    .values({
      userId: adminUserData.id,
      roleId: adminRoleId,
    })
    .onDuplicateKeyUpdate({ set: { userId: adminUserData.id } });

  console.log("✅ Utilisateur admin créé:", adminUserData.email);
  console.log("   Mot de passe: admin123");

  // ============================================
  // 6. CRÉER DES CATÉGORIES
  // ============================================
  console.log("\n📁 Création des catégories...");

  const categoriesData = [
    { name: "Actualités", slug: "actualites", description: "Actualités de la confrérie" },
    { name: "Enseignements", slug: "enseignements", description: "Enseignements spirituels" },
    { name: "Événements", slug: "evenements", description: "Événements à venir" },
    { name: "Histoire", slug: "histoire", description: "Histoire de la confrérie" },
  ];

  for (const cat of categoriesData) {
    await db
      .insert(schema.categories)
      .values(cat)
      .onDuplicateKeyUpdate({ set: { name: cat.name } });
  }

  console.log("✅ Catégories créées:", categoriesData.length);

  // ============================================
  // 7. CRÉER DES TAGS
  // ============================================
  console.log("\n🏷️  Création des tags...");

  const tagsData = [
    { name: "Spiritualité", slug: "spiritualite" },
    { name: "Prière", slug: "priere" },
    { name: "Méditation", slug: "meditation" },
    { name: "Coran", slug: "coran" },
    { name: "Hadith", slug: "hadith" },
  ];

  for (const tag of tagsData) {
    await db
      .insert(schema.tags)
      .values(tag)
      .onDuplicateKeyUpdate({ set: { name: tag.name } });
  }

  console.log("✅ Tags créés:", tagsData.length);

  // ============================================
  // 8. CRÉER UN ARTICLE DE TEST
  // ============================================
  console.log("\n📝 Création d'un article de test...");

  const [category] = await db
    .select()
    .from(schema.categories)
    .where((categories) => categories.slug === "actualites")
    .limit(1);

  const [tag] = await db
    .select()
    .from(schema.tags)
    .where((tags) => tags.slug === "spiritualite")
    .limit(1);

  const [post] = await db
    .insert(schema.posts)
    .values({
      title: "Bienvenue sur Fathul Fattah",
      slug: "bienvenue-fathul-fattah",
      content: `# Bienvenue sur Fathul Fattah

Nous sommes heureux de vous accueillir sur notre nouvelle plateforme numérique.

## Notre Mission

Fathul Fattah est une confrérie dédiée à l'enseignement spirituel et à la préservation de notre patrimoine.

## Nos Valeurs

- Spiritualité
- Partage
- Connaissance
- Fraternité

Restez connectés pour découvrir nos enseignements, événements et bien plus encore !`,
      excerpt: "Découvrez la nouvelle plateforme numérique de Fathul Fattah",
      authorId: adminUserData.id,
      status: "PUBLISHED",
      publishedAt: new Date(),
      metaTitle: "Bienvenue sur Fathul Fattah",
      metaDescription: "Découvrez la nouvelle plateforme numérique de la confrérie Fathul Fattah",
    })
    .onDuplicateKeyUpdate({ set: { title: "Bienvenue sur Fathul Fattah" } });

  // Récupérer l'article créé
  const [postData] = await db
    .select()
    .from(schema.posts)
    .where((posts) => posts.slug === "bienvenue-fathul-fattah")
    .limit(1);

  // Associer la catégorie
  await db
    .insert(schema.postCategories)
    .values({
      postId: postData.id,
      categoryId: category.id,
    })
    .onDuplicateKeyUpdate({ set: { postId: postData.id } });

  // Associer le tag
  await db
    .insert(schema.postTags)
    .values({
      postId: postData.id,
      tagId: tag.id,
    })
    .onDuplicateKeyUpdate({ set: { postId: postData.id } });

  console.log("✅ Article créé:", postData.title);

  // ============================================
  // RÉSUMÉ
  // ============================================
  console.log("\n✅ Seeding terminé avec succès !");
  console.log("\n📊 Résumé:");
  console.log("   - 3 rôles créés");
  console.log("   - 12 permissions créées");
  console.log("   - 1 utilisateur admin créé");
  console.log("   - 4 catégories créées");
  console.log("   - 5 tags créés");
  console.log("   - 1 article créé");
  console.log("\n🔑 Identifiants admin:");
  console.log("   Email: admin@fathul-fattah.dev");
  console.log("   Mot de passe: admin123");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });

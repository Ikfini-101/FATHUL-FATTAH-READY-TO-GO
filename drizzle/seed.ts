/**
 * Script de seed pour initialiser la base de données Fathul Fattah
 * Données contextuelles : Culture sénégalaise, éducation islamique, patrimoine
 */

import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";
import * as bcrypt from "bcrypt";

const db = drizzle(process.env.DATABASE_URL!, { schema, mode: "default" });

async function main() {
  console.log("🌱 Début du seeding de la base de données Fathul Fattah...");

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
      email: "admin@fathul-fattah.sn",
      name: "Administrateur Fathul Fattah",
      password: hashedPassword,
      emailVerified: new Date(),
      role: "admin",
    })
    .onDuplicateKeyUpdate({ set: { email: "admin@fathul-fattah.sn" } });

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

  // ============================================
  // 6. CRÉER DES CATÉGORIES CONTEXTUELLES
  // ============================================
  console.log("\n📁 Création des catégories...");

  const categoriesData = [
    { name: "Culture Sénégalaise", slug: "culture-senegalaise", description: "Traditions, arts et patrimoine du Sénégal" },
    { name: "Éducation Islamique", slug: "education-islamique", description: "Enseignements religieux et spirituels" },
    { name: "Histoire", slug: "histoire", description: "Histoire du Sénégal et de l'Islam en Afrique" },
    { name: "Patrimoine", slug: "patrimoine", description: "Sites historiques et monuments" },
    { name: "Actualités", slug: "actualites", description: "Actualités de la communauté" },
    { name: "Événements", slug: "evenements", description: "Événements culturels et religieux" },
  ];

  for (const cat of categoriesData) {
    await db
      .insert(schema.categories)
      .values(cat)
      .onDuplicateKeyUpdate({ set: { name: cat.name } });
  }

  console.log("✅ Catégories créées:", categoriesData.length);

  // ============================================
  // 7. CRÉER DES TAGS CONTEXTUELS
  // ============================================
  console.log("\n🏷️  Création des tags...");

  const tagsData = [
    { name: "Sénégal", slug: "senegal" },
    { name: "Islam", slug: "islam" },
    { name: "Mouridisme", slug: "mouridisme" },
    { name: "Wolof", slug: "wolof" },
    { name: "Tradition", slug: "tradition" },
    { name: "Coran", slug: "coran" },
    { name: "Hadith", slug: "hadith" },
    { name: "Spiritualité", slug: "spiritualite" },
    { name: "Touba", slug: "touba" },
    { name: "Magal", slug: "magal" },
  ];

  for (const tag of tagsData) {
    await db
      .insert(schema.tags)
      .values(tag)
      .onDuplicateKeyUpdate({ set: { name: tag.name } });
  }

  console.log("✅ Tags créés:", tagsData.length);

  // ============================================
  // 8. CRÉER DES ARTICLES CONTEXTUELS
  // ============================================
  console.log("\n📝 Création des articles...");

  const categories = await db.select().from(schema.categories);
  const tags = await db.select().from(schema.tags);

  const articlesData = [
    {
      title: "Bienvenue sur Fathul Fattah",
      slug: "bienvenue-fathul-fattah",
      content: `# Bienvenue sur Fathul Fattah

Nous sommes heureux de vous accueillir sur la plateforme numérique de Fathul Fattah, un espace dédié à la préservation et au partage de notre riche patrimoine culturel et spirituel sénégalais.

## Notre Mission

Fathul Fattah s'engage à promouvoir l'éducation islamique, la culture sénégalaise et la préservation de notre patrimoine historique à travers des outils numériques innovants.

## Nos Valeurs

- **Spiritualité** : Approfondir la connaissance de l'Islam
- **Culture** : Célébrer la richesse de la culture sénégalaise
- **Éducation** : Transmettre le savoir aux générations futures
- **Patrimoine** : Préserver notre héritage historique

Explorez nos contenus, participez à nos événements et rejoignez notre communauté !`,
      excerpt: "Découvrez la plateforme numérique dédiée à la culture sénégalaise et à l'éducation islamique",
      categorySlug: "actualites",
      tagSlugs: ["senegal", "islam"],
    },
    {
      title: "Le Grand Magal de Touba : Histoire et Signification",
      slug: "grand-magal-touba",
      content: `# Le Grand Magal de Touba

Le Grand Magal de Touba est l'un des plus grands pèlerinages musulmans d'Afrique, commémorant l'exil de Cheikh Ahmadou Bamba, fondateur du mouridisme.

## Origines Historiques

En 1895, Cheikh Ahmadou Bamba fut exilé au Gabon par l'administration coloniale française. Cet événement marqua un tournant dans l'histoire du mouridisme au Sénégal.

## Signification Spirituelle

Le Magal symbolise la résistance pacifique, la foi inébranlable et le triomphe de la spiritualité sur l'oppression.

## Célébrations Contemporaines

Chaque année, des millions de fidèles convergent vers Touba pour célébrer cet événement majeur, dans un esprit de fraternité et de dévotion.`,
      excerpt: "Découvrez l'histoire et la signification spirituelle du Grand Magal de Touba",
      categorySlug: "education-islamique",
      tagSlugs: ["mouridisme", "touba", "magal"],
    },
    {
      title: "La Langue Wolof : Pilier de l'Identité Sénégalaise",
      slug: "langue-wolof-identite",
      content: `# La Langue Wolof

Le wolof est la langue la plus parlée au Sénégal, véhicule privilégié de la culture et des traditions sénégalaises.

## Importance Culturelle

Plus qu'un simple moyen de communication, le wolof porte en lui toute la richesse de la culture sénégalaise : proverbes, contes, chants et traditions orales.

## Préservation et Transmission

Face à la mondialisation, la préservation du wolof représente un enjeu majeur pour les générations futures.

## Wolof et Islam

Le wolof a joué un rôle essentiel dans la diffusion de l'Islam au Sénégal, permettant l'adaptation des enseignements religieux au contexte local.`,
      excerpt: "Explorez la richesse de la langue wolof et son rôle dans la culture sénégalaise",
      categorySlug: "culture-senegalaise",
      tagSlugs: ["wolof", "tradition", "senegal"],
    },
    {
      title: "Les Mosquées Historiques du Sénégal",
      slug: "mosquees-historiques-senegal",
      content: `# Les Mosquées Historiques du Sénégal

Le Sénégal abrite des mosquées remarquables qui témoignent de l'ancienneté et de la profondeur de l'Islam en Afrique de l'Ouest.

## La Grande Mosquée de Touba

Construite par Cheikh Ahmadou Bamba, elle est le cœur spirituel du mouridisme et peut accueillir des dizaines de milliers de fidèles.

## La Mosquée de la Divinité de Dakar

Monument emblématique de la capitale, elle combine architecture moderne et tradition islamique.

## La Mosquée de Saint-Louis

Témoignage de l'histoire coloniale et de la résistance culturelle, elle représente un patrimoine architectural unique.`,
      excerpt: "Découvrez les mosquées historiques qui façonnent le paysage spirituel du Sénégal",
      categorySlug: "patrimoine",
      tagSlugs: ["islam", "patrimoine", "touba"],
    },
    {
      title: "L'Artisanat Sénégalais : Entre Tradition et Modernité",
      slug: "artisanat-senegalais",
      content: `# L'Artisanat Sénégalais

L'artisanat sénégalais représente un savoir-faire ancestral transmis de génération en génération.

## Les Techniques Traditionnelles

Du tissage au travail du cuir, en passant par la poterie et la sculpture sur bois, chaque technique raconte une histoire.

## L'Art du Boubou

Le boubou sénégalais, vêtement traditionnel par excellence, combine élégance et confort dans des tissus richement brodés.

## Artisanat et Économie

L'artisanat joue un rôle économique majeur, offrant des opportunités d'emploi tout en préservant le patrimoine culturel.`,
      excerpt: "Plongez dans l'univers de l'artisanat sénégalais et découvrez ses techniques ancestrales",
      categorySlug: "culture-senegalaise",
      tagSlugs: ["tradition", "senegal"],
    },
  ];

  for (const article of articlesData) {
    const category = categories.find((c) => c.slug === article.categorySlug);
    const articleTags = tags.filter((t) => article.tagSlugs.includes(t.slug));

    const [post] = await db
      .insert(schema.posts)
      .values({
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        authorId: adminUserData.id,
        status: "PUBLISHED",
        publishedAt: new Date(),
        metaTitle: article.title,
        metaDescription: article.excerpt,
      })
      .onDuplicateKeyUpdate({ set: { title: article.title } });

    // Récupérer l'article créé
    const [postData] = await db
      .select()
      .from(schema.posts)
      .where((posts) => posts.slug === article.slug)
      .limit(1);

    // Associer la catégorie
    if (category) {
      await db
        .insert(schema.postCategories)
        .values({
          postId: postData.id,
          categoryId: category.id,
        })
        .onDuplicateKeyUpdate({ set: { postId: postData.id } });
    }

    // Associer les tags
    for (const tag of articleTags) {
      await db
        .insert(schema.postTags)
        .values({
          postId: postData.id,
          tagId: tag.id,
        })
        .onDuplicateKeyUpdate({ set: { postId: postData.id } });
    }

    console.log("✅ Article créé:", article.title);
  }

  // ============================================
  // 9. CRÉER DES PRODUITS POUR L'E-BOUTIQUE
  // ============================================
  console.log("\n🛍️  Création des produits...");

  const productsData = [
    {
      name: "Coran avec Traduction en Français",
      slug: "coran-traduction-francais",
      description: "Coran complet avec traduction française et translittération phonétique. Couverture rigide de qualité.",
      price: 25000, // 25 000 FCFA
      stock: 50,
      imageUrl: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800",
    },
    {
      name: "Boubou Traditionnel Brodé",
      slug: "boubou-traditionnel-brode",
      description: "Boubou sénégalais en bazin riche avec broderies artisanales. Disponible en plusieurs couleurs.",
      price: 75000, // 75 000 FCFA
      stock: 20,
      imageUrl: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800",
    },
    {
      name: "Chapelet en Bois d'Ébène",
      slug: "chapelet-bois-ebene",
      description: "Chapelet musulman (Tasbih) en bois d'ébène authentique, 99 perles. Artisanat sénégalais.",
      price: 15000, // 15 000 FCFA
      stock: 100,
      imageUrl: "https://images.unsplash.com/photo-1584286595398-a59f21d8d6b8?w=800",
    },
    {
      name: "Tapis de Prière Deluxe",
      slug: "tapis-priere-deluxe",
      description: "Tapis de prière en velours épais avec motifs islamiques. Confortable et durable.",
      price: 12000, // 12 000 FCFA
      stock: 75,
      imageUrl: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800",
    },
    {
      name: "Livre : Histoire du Mouridisme",
      slug: "livre-histoire-mouridisme",
      description: "Ouvrage complet sur l'histoire et les enseignements de Cheikh Ahmadou Bamba. 350 pages.",
      price: 18000, // 18 000 FCFA
      stock: 40,
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
    },
    {
      name: "Panier Artisanal en Raphia",
      slug: "panier-artisanal-raphia",
      description: "Panier tressé à la main en raphia naturel. Artisanat traditionnel sénégalais.",
      price: 8000, // 8 000 FCFA
      stock: 60,
      imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800",
    },
    {
      name: "Encens Naturel - Thiouraye",
      slug: "encens-naturel-thiouraye",
      description: "Encens traditionnel sénégalais (Thiouraye) pour purifier l'atmosphère. Boîte de 100g.",
      price: 5000, // 5 000 FCFA
      stock: 150,
      imageUrl: "https://images.unsplash.com/photo-1602874801006-e24b3e94c031?w=800",
    },
    {
      name: "Djellaba Homme Blanc",
      slug: "djellaba-homme-blanc",
      description: "Djellaba traditionnelle en coton blanc pour homme. Idéale pour la prière et les cérémonies.",
      price: 35000, // 35 000 FCFA
      stock: 30,
      imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
    },
  ];

  for (const product of productsData) {
    await db
      .insert(schema.products)
      .values(product)
      .onDuplicateKeyUpdate({ set: { name: product.name } });

    console.log("✅ Produit créé:", product.name);
  }

  // ============================================
  // 10. CRÉER DES ÉMISSIONS RADIO
  // ============================================
  console.log("\n📻 Création des émissions radio...");

  const radioShowsData = [
    {
      title: "Khassaides du Matin",
      slug: "khassaides-matin",
      description: "Récitation et explication des Khassaides de Cheikh Ahmadou Bamba chaque matin.",
      host: "Serigne Moustapha Sy",
      schedule: "Lundi-Vendredi 6h-7h",
      duration: 60,
      coverImage: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800",
    },
    {
      title: "Culture et Tradition",
      slug: "culture-tradition",
      description: "Émission dédiée à la culture sénégalaise, aux traditions et au patrimoine.",
      host: "Fatou Diop",
      schedule: "Mercredi 14h-15h",
      duration: 60,
      coverImage: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800",
    },
    {
      title: "Questions de Foi",
      slug: "questions-foi",
      description: "Réponses aux questions des auditeurs sur l'Islam et la spiritualité.",
      host: "Imam Abdoulaye Diouf",
      schedule: "Samedi 16h-18h",
      duration: 120,
      coverImage: "https://images.unsplash.com/photo-1590602846989-e99596d2a6ee?w=800",
    },
    {
      title: "Wolof et Sagesse",
      slug: "wolof-sagesse",
      description: "Proverbes wolof, contes traditionnels et enseignements de sagesse.",
      host: "Awa Thiam",
      schedule: "Dimanche 10h-11h",
      duration: 60,
      coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
    },
  ];

  for (const show of radioShowsData) {
    await db
      .insert(schema.radioShows)
      .values(show)
      .onDuplicateKeyUpdate({ set: { title: show.title } });

    console.log("✅ Émission radio créée:", show.title);
  }

  // ============================================
  // 11. CRÉER DES EXPOSITIONS VR
  // ============================================
  console.log("\n🥽 Création des expositions VR...");

  const vrExhibitionsData = [
    {
      title: "La Grande Mosquée de Touba",
      slug: "grande-mosquee-touba",
      description: "Visite virtuelle immersive de la Grande Mosquée de Touba, haut lieu spirituel du mouridisme.",
      thumbnailUrl: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800",
      sceneUrl: "https://vr.fathul-fattah.sn/touba-mosque",
    },
    {
      title: "Île de Gorée : Mémoire et Histoire",
      slug: "ile-goree-memoire",
      description: "Parcourez l'île de Gorée et découvrez son histoire marquante dans le commerce triangulaire.",
      thumbnailUrl: "https://images.unsplash.com/photo-1564221710304-0b37c8b9d729?w=800",
      sceneUrl: "https://vr.fathul-fattah.sn/goree-island",
    },
    {
      title: "Artisanat Traditionnel Sénégalais",
      slug: "artisanat-traditionnel",
      description: "Explorez les techniques artisanales ancestrales : tissage, poterie, sculpture et bijouterie.",
      thumbnailUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
      sceneUrl: "https://vr.fathul-fattah.sn/artisanat",
    },
  ];

  for (const exhibition of vrExhibitionsData) {
    await db
      .insert(schema.vrExhibitions)
      .values(exhibition)
      .onDuplicateKeyUpdate({ set: { title: exhibition.title } });

    console.log("✅ Exposition VR créée:", exhibition.title);
  }

  // ============================================
  // RÉSUMÉ
  // ============================================
  console.log("\n✅ Seeding terminé avec succès !");
  console.log("\n📊 Résumé:");
  console.log("   - 3 rôles créés");
  console.log("   - 12 permissions créées");
  console.log("   - 1 utilisateur admin créé");
  console.log("   - 6 catégories créées");
  console.log("   - 10 tags créés");
  console.log("   - 5 articles créés");
  console.log("   - 8 produits créés");
  console.log("   - 4 émissions radio créées");
  console.log("   - 3 expositions VR créées");
  console.log("\n🔑 Identifiants admin:");
  console.log("   Email: admin@fathul-fattah.sn");
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

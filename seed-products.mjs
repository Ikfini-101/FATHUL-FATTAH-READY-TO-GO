import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL non définie');
  process.exit(1);
}

async function seed() {
  const connection = await mysql.createConnection(DATABASE_URL);

  try {
    console.log('🌱 Création des catégories de produits...');

    // Catégories
    const categories = [
      {
        name: 'Livres Mourides',
        slug: 'livres-mourides',
        description: 'Ouvrages sur le Mouridisme et les enseignements de Cheikh Ahmadou Bamba',
        displayOrder: 1
      },
      {
        name: 'Ouvrages Islamiques',
        slug: 'ouvrages-islamiques',
        description: 'Livres sur l\'Islam, le Coran et la Sunna',
        displayOrder: 2
      },
      {
        name: 'Khassaides',
        slug: 'khassaides',
        description: 'Recueils de poèmes spirituels de Cheikh Ahmadou Bamba',
        displayOrder: 3
      },
      {
        name: 'Articles Spirituels',
        slug: 'articles-spirituels',
        description: 'Chapelets, tapis de prière et autres articles religieux',
        displayOrder: 4
      },
      {
        name: 'Biographies',
        slug: 'biographies',
        description: 'Biographies des grands maîtres soufis et figures islamiques',
        displayOrder: 5
      }
    ];

    for (const cat of categories) {
      await connection.execute(
        `INSERT INTO productCategories (name, slug, description, displayOrder) 
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE description = VALUES(description), displayOrder = VALUES(displayOrder)`,
        [cat.name, cat.slug, cat.description, cat.displayOrder]
      );
    }

    console.log('✅ Catégories créées');

    // Récupérer les IDs des catégories
    const [catRows] = await connection.execute('SELECT id, slug FROM productCategories');
    const catMap = Object.fromEntries(catRows.map(r => [r.slug, r.id]));

    console.log('🌱 Création des produits...');

    // Produits
    const products = [
      {
        name: 'Matlabul Fawzayni - Édition Complète',
        slug: 'matlabul-fawzayni-edition-complete',
        description: 'Recueil complet des poèmes de Cheikh Ahmadou Bamba. Édition bilingue arabe-français avec commentaires.',
        price: 15000,
        compareAtPrice: 18000,
        stock: 25,
        categoryId: catMap['khassaides'],
        featured: true,
        sku: 'KHA-MAT-001',
        weight: 800,
        images: JSON.stringify(['https://via.placeholder.com/400x400/FF8C00/FFFFFF?text=Matlabul+Fawzayni'])
      },
      {
        name: 'Jazbul Qulub - Le Ravissement des Cœurs',
        slug: 'jazbul-qulub-ravissement-coeurs',
        description: 'Poème mystique sur l\'amour divin et la quête spirituelle. Texte arabe avec traduction française.',
        price: 8000,
        stock: 40,
        categoryId: catMap['khassaides'],
        featured: true,
        sku: 'KHA-JAZ-001',
        weight: 350,
        images: JSON.stringify(['https://via.placeholder.com/400x400/228B22/FFFFFF?text=Jazbul+Qulub'])
      },
      {
        name: 'Biographie de Cheikh Ahmadou Bamba',
        slug: 'biographie-cheikh-ahmadou-bamba',
        description: 'Biographie complète du fondateur du Mouridisme, de sa naissance à Touba jusqu\'à son retour d\'exil.',
        price: 12000,
        compareAtPrice: 15000,
        stock: 30,
        categoryId: catMap['biographies'],
        featured: true,
        sku: 'BIO-CAB-001',
        weight: 600,
        images: JSON.stringify(['https://via.placeholder.com/400x400/4169E1/FFFFFF?text=Biographie+CAB'])
      },
      {
        name: 'Les 40 Hadiths de l\'Imam An-Nawawi',
        slug: '40-hadiths-imam-nawawi',
        description: 'Collection des 40 hadiths essentiels de l\'Islam avec explications détaillées en français.',
        price: 6000,
        stock: 50,
        categoryId: catMap['ouvrages-islamiques'],
        featured: false,
        sku: 'ISL-HAD-001',
        weight: 300,
        images: JSON.stringify(['https://via.placeholder.com/400x400/DC143C/FFFFFF?text=40+Hadiths'])
      },
      {
        name: 'Chapelet Tasbih 99 Perles',
        slug: 'chapelet-tasbih-99-perles',
        description: 'Chapelet de prière en bois d\'olivier avec 99 perles. Fabriqué artisanalement.',
        price: 3500,
        stock: 60,
        categoryId: catMap['articles-spirituels'],
        featured: false,
        sku: 'ART-CHA-001',
        weight: 50,
        images: JSON.stringify(['https://via.placeholder.com/400x400/8B4513/FFFFFF?text=Chapelet+99'])
      },
      {
        name: 'Tapis de Prière Deluxe',
        slug: 'tapis-priere-deluxe',
        description: 'Tapis de prière épais et confortable avec motifs islamiques. Dimensions: 120x80cm.',
        price: 8500,
        stock: 20,
        categoryId: catMap['articles-spirituels'],
        featured: true,
        sku: 'ART-TAP-001',
        weight: 1200,
        images: JSON.stringify(['https://via.placeholder.com/400x400/006400/FFFFFF?text=Tapis+Priere'])
      },
      {
        name: 'Massalikul Jinan - Le Chemin du Paradis',
        slug: 'massalikul-jinan-chemin-paradis',
        description: 'Poème sur les voies menant au Paradis. Texte arabe avec traduction et commentaires.',
        price: 10000,
        stock: 35,
        categoryId: catMap['khassaides'],
        featured: false,
        sku: 'KHA-MAS-001',
        weight: 450,
        images: JSON.stringify(['https://via.placeholder.com/400x400/FF6347/FFFFFF?text=Massalikul+Jinan'])
      },
      {
        name: 'Vie de Serigne Touba - Édition Illustrée',
        slug: 'vie-serigne-touba-edition-illustree',
        description: 'Biographie illustrée de Cheikh Ahmadou Bamba avec photos historiques et cartes de Touba.',
        price: 18000,
        stock: 15,
        categoryId: catMap['biographies'],
        featured: false,
        sku: 'BIO-STO-001',
        weight: 900,
        images: JSON.stringify(['https://via.placeholder.com/400x400/9370DB/FFFFFF?text=Vie+Serigne+Touba'])
      },
      {
        name: 'Le Coran - Traduction Française',
        slug: 'coran-traduction-francaise',
        description: 'Le Saint Coran avec traduction française de Muhammad Hamidullah. Couverture cartonnée.',
        price: 14000,
        stock: 45,
        categoryId: catMap['ouvrages-islamiques'],
        featured: false,
        sku: 'ISL-COR-001',
        weight: 1000,
        images: JSON.stringify(['https://via.placeholder.com/400x400/FFD700/000000?text=Le+Coran'])
      },
      {
        name: 'Encens Bakhour Premium',
        slug: 'encens-bakhour-premium',
        description: 'Encens de qualité supérieure pour parfumer votre maison. Boîte de 50g.',
        price: 2500,
        stock: 80,
        categoryId: catMap['articles-spirituels'],
        featured: false,
        sku: 'ART-ENC-001',
        weight: 100,
        images: JSON.stringify(['https://via.placeholder.com/400x400/8B008B/FFFFFF?text=Bakhour'])
      }
    ];

    for (const product of products) {
      await connection.execute(
        `INSERT INTO products (name, slug, description, price, compareAtPrice, stock, categoryId, featured, sku, weight, images, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
         ON DUPLICATE KEY UPDATE 
           description = VALUES(description),
           price = VALUES(price),
           compareAtPrice = VALUES(compareAtPrice),
           stock = VALUES(stock),
           featured = VALUES(featured),
           weight = VALUES(weight),
           images = VALUES(images)`,
        [
          product.name,
          product.slug,
          product.description,
          product.price,
          product.compareAtPrice || null,
          product.stock,
          product.categoryId,
          product.featured,
          product.sku,
          product.weight,
          product.images
        ]
      );
    }

    console.log('✅ Produits créés');
    console.log('\n📊 Résumé:');
    console.log(`   - ${categories.length} catégories`);
    console.log(`   - ${products.length} produits`);
    console.log(`   - ${products.filter(p => p.featured).length} produits vedettes`);

  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seed()
  .then(() => {
    console.log('\n✅ Seed terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Échec du seed:', error);
    process.exit(1);
  });

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root:root123@localhost:3306/fathul_fattah';

async function seedAllData() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('🌱 Début du seed des données...');
  
  try {
    // 1. Catégories de produits
    console.log('📦 Ajout des catégories de produits...');
    await connection.execute(`
      INSERT INTO productCategories (name, slug, description) VALUES
      ('Livres', 'livres', 'Ouvrages islamiques et mourides'),
      ('Audio', 'audio', 'CD et enregistrements audio'),
      ('Vêtements', 'vetements', 'Vêtements traditionnels'),
      ('Accessoires', 'accessoires', 'Chapelets, tapis de prière, etc.')
      ON DUPLICATE KEY UPDATE name=name
    `);
    
    // 2. Produits
    console.log('🛒 Ajout des produits...');
    await connection.execute(`
      INSERT INTO products (name, slug, description, price, stock, categoryId, imageUrl) VALUES
      ('Khassaides de Serigne Touba', 'khassaides-serigne-touba', 'Recueil complet des poèmes de Cheikh Ahmadou Bamba', 25.00, 50, 1, '/images/products/khassaides.jpg'),
      ('Matlabul Fawzayni', 'matlabul-fawzayni', 'Traité spirituel de Cheikh Ahmadou Bamba', 30.00, 30, 1, '/images/products/matlabul.jpg'),
      ('CD Khassida Touba', 'cd-khassida-touba', 'Enregistrement des khassaides', 15.00, 100, 2, '/images/products/cd-khassida.jpg'),
      ('Boubou traditionnel', 'boubou-traditionnel', 'Vêtement traditionnel sénégalais', 80.00, 20, 3, '/images/products/boubou.jpg'),
      ('Chapelet 99 grains', 'chapelet-99-grains', 'Chapelet en bois pour le dhikr', 10.00, 150, 4, '/images/products/chapelet.jpg')
      ON DUPLICATE KEY UPDATE name=name
    `);
    
    // 3. Émissions de radio
    console.log('📻 Ajout des émissions de radio...');
    await connection.execute(`
      INSERT INTO radioShows (title, slug, description, schedule, hostName) VALUES
      ('Khassaides du Matin', 'khassaides-matin', 'Récitation des khassaides tous les matins', 'Lundi-Vendredi 6h-7h', 'Serigne Moustapha'),
      ('Enseignements Mourides', 'enseignements-mourides', 'Cours sur le Mouridisme', 'Samedi 14h-16h', 'Serigne Abdou'),
      ('Questions-Réponses', 'questions-reponses', 'Réponses aux questions des auditeurs', 'Dimanche 10h-12h', 'Serigne Cheikh')
      ON DUPLICATE KEY UPDATE title=title
    `);
    
    // 4. Épisodes de radio
    console.log('🎙️ Ajout des épisodes de radio...');
    const [shows] = await connection.execute('SELECT id FROM radioShows LIMIT 1');
    const showId = shows[0]?.id || 1;
    
    await connection.execute(`
      INSERT INTO radioEpisodes (showId, title, slug, description, audioUrl, duration, publishedAt) VALUES
      (${showId}, 'Khassida Touba', 'khassida-touba-ep1', 'Récitation de la Khassida Touba', '/audio/khassida-touba.mp3', 3600, NOW()),
      (${showId}, 'Matlabul Fawzayni', 'matlabul-fawzayni-ep1', 'Explication du Matlabul Fawzayni', '/audio/matlabul.mp3', 2400, NOW()),
      (${showId}, 'Massalikul Jinaan', 'massalikul-jinaan-ep1', 'Commentaire du Massalikul Jinaan', '/audio/massalikul.mp3', 1800, NOW())
      ON DUPLICATE KEY UPDATE title=title
    `);
    
    // 5. Documents de la bibliothèque
    console.log('📚 Ajout des documents...');
    await connection.execute(`
      INSERT INTO doc_items (title, author, type, language, publicationYear, description, coverImageUrl) VALUES
      ('Khassaides de Serigne Touba', 'Cheikh Ahmadou Bamba', 'book', 'ar', 1927, 'Recueil complet des poèmes mystiques', '/images/docs/khassaides-cover.jpg'),
      ('Matlabul Fawzayni', 'Cheikh Ahmadou Bamba', 'book', 'ar', 1902, 'Traité sur la voie spirituelle', '/images/docs/matlabul-cover.jpg'),
      ('Massalikul Jinaan', 'Cheikh Ahmadou Bamba', 'book', 'ar', 1910, 'Les voies du Paradis', '/images/docs/massalikul-cover.jpg'),
      ('Histoire du Mouridisme', 'Serigne Bachir Mbacké', 'book', 'fr', 1995, 'Histoire complète de la confrérie mouride', '/images/docs/histoire-cover.jpg')
      ON DUPLICATE KEY UPDATE title=title
    `);
    
    // 6. Catégories
    console.log('🏷️ Ajout des catégories...');
    await connection.execute(`
      INSERT INTO categories (name, slug, type) VALUES
      ('Spiritualité', 'spiritualite', 'post'),
      ('Histoire', 'histoire', 'post'),
      ('Événements', 'evenements', 'event'),
      ('Enseignements', 'enseignements', 'post')
      ON DUPLICATE KEY UPDATE name=name
    `);
    
    // 7. Articles
    console.log('📝 Ajout des articles...');
    const [categories] = await connection.execute('SELECT id FROM categories WHERE type="post" LIMIT 1');
    const categoryId = categories[0]?.id || 1;
    
    await connection.execute(`
      INSERT INTO posts (title, slug, content, excerpt, categoryId, publishedAt, status) VALUES
      ('Biographie de Cheikh Ahmadou Bamba', 'biographie-cheikh-ahmadou-bamba', 
       'Cheikh Ahmadou Bamba (1853-1927) est le fondateur de la confrérie mouride au Sénégal...', 
       'Découvrez la vie extraordinaire du fondateur du Mouridisme', 
       ${categoryId}, NOW(), 'published'),
      ('Les enseignements du Mouridisme', 'enseignements-mouridisme', 
       'Le Mouridisme repose sur trois piliers fondamentaux : le travail, la discipline et la dévotion...', 
       'Les principes fondamentaux de la voie mouride', 
       ${categoryId}, NOW(), 'published'),
      ('Touba : La ville sainte', 'touba-ville-sainte', 
       'Touba est la ville sainte du Mouridisme, fondée par Cheikh Ahmadou Bamba en 1887...', 
       'Histoire et importance de la ville sainte de Touba', 
       ${categoryId}, NOW(), 'published')
      ON DUPLICATE KEY UPDATE title=title
    `);
    
    // 8. Événements
    console.log('📅 Ajout des événements...');
    const [eventCategories] = await connection.execute('SELECT id FROM categories WHERE type="event" LIMIT 1');
    const eventCategoryId = eventCategories[0]?.id || 1;
    
    await connection.execute(`
      INSERT INTO events (title, slug, description, startDate, endDate, location, categoryId, status) VALUES
      ('Grand Magal de Touba 2024', 'grand-magal-touba-2024', 
       'Pèlerinage annuel à Touba en commémoration de l\'exil de Cheikh Ahmadou Bamba', 
       '2024-09-15', '2024-09-16', 'Touba, Sénégal', ${eventCategoryId}, 'published'),
      ('Gamou 2024', 'gamou-2024', 
       'Célébration de la naissance du Prophète Muhammad (PSL)', 
       '2024-09-27', '2024-09-27', 'Tivaouane, Sénégal', ${eventCategoryId}, 'published'),
      ('Conférence sur le Mouridisme', 'conference-mouridisme-2024', 
       'Conférence internationale sur les enseignements mourides', 
       '2024-11-10', '2024-11-12', 'Dakar, Sénégal', ${eventCategoryId}, 'published')
      ON DUPLICATE KEY UPDATE title=title
    `);
    
    console.log('✅ Seed terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
  } finally {
    await connection.end();
  }
}

seedAllData();

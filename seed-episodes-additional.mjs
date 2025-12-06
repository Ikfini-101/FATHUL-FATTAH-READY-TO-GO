import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

// Charger variables d'environnement
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL non définie');
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

console.log('🎧 Ajout Épisodes Supplémentaires - Début...\n');

// Récupérer les IDs des émissions existantes
console.log('📻 Récupération des émissions existantes...');
const [shows] = await connection.execute('SELECT id, slug FROM radioShows ORDER BY id');
console.log(`  ✅ ${shows.length} émissions trouvées\n`);

// Mapper les slugs vers les IDs
const showMap = {};
shows.forEach(show => {
  showMap[show.slug] = show.id;
});

// Créer épisodes podcasts supplémentaires
console.log('🎧 Création des épisodes supplémentaires...');

const episodes = [
  {
    showSlug: 'tariqa-mouride',
    title: 'Les principes fondamentaux de la Tariqa Mouride',
    description: 'Introduction aux principes fondamentaux de la voie mouride',
    titleI18n: JSON.stringify({
      fr: 'Les principes fondamentaux de la Tariqa Mouride',
      ar: 'المبادئ الأساسية للطريقة المريدية',
      en: 'The fundamental principles of the Mouride Path'
    }),
    descriptionI18n: JSON.stringify({
      fr: 'Introduction aux principes fondamentaux de la voie mouride : le travail (khidma), la soumission au guide spirituel, et la quête de la connaissance divine.',
      ar: 'مقدمة للمبادئ الأساسية للطريقة المريدية: العمل والخضوع للمرشد الروحي والسعي للمعرفة الإلهية',
      en: 'Introduction to the fundamental principles of the Mouride path: work (khidma), submission to the spiritual guide, and the quest for divine knowledge.'
    }),
    slug: 'principes-tariqa-mouride',
    audioUrl: 'https://example.com/podcasts/principes-tariqa.mp3',
    duration: 2100,
    fileSize: 33600000,
    status: 'published',
    publishedAt: new Date('2025-11-30')
  },
  {
    showSlug: 'histoire-mouridisme',
    title: 'La fondation de Touba par Cheikh Ahmadou Bamba',
    description: 'Récit de la fondation de la ville sainte de Touba',
    titleI18n: JSON.stringify({
      fr: 'La fondation de Touba par Cheikh Ahmadou Bamba',
      ar: 'تأسيس طوبى من قبل الشيخ أحمدو بامبا',
      en: 'The foundation of Touba by Cheikh Ahmadou Bamba'
    }),
    descriptionI18n: JSON.stringify({
      fr: 'Récit de la fondation de la ville sainte de Touba en 1887. Vision spirituelle de Cheikh Ahmadou Bamba et construction de la cité religieuse.',
      ar: 'قصة تأسيس المدينة المقدسة طوبى عام 1887. الرؤية الروحية للشيخ أحمدو بامبا وبناء المدينة الدينية',
      en: 'Story of the foundation of the holy city of Touba in 1887. Spiritual vision of Cheikh Ahmadou Bamba and construction of the religious city.'
    }),
    slug: 'fondation-touba',
    audioUrl: 'https://example.com/podcasts/fondation-touba.mp3',
    duration: 2850,
    fileSize: 45600000,
    status: 'published',
    publishedAt: new Date('2025-12-04')
  }
];

for (const episode of episodes) {
  const showId = showMap[episode.showSlug];
  if (!showId) {
    console.log(`  ⚠️  Émission "${episode.showSlug}" non trouvée, épisode ignoré: ${episode.title}`);
    continue;
  }

  await connection.execute(
    `INSERT INTO radioEpisodes (showId, title, description, titleI18n, descriptionI18n, slug, audioUrl, duration, fileSize, status, publishedAt, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [showId, episode.title, episode.description, episode.titleI18n, episode.descriptionI18n, episode.slug, episode.audioUrl, episode.duration, episode.fileSize, episode.status, episode.publishedAt]
  );
  const title = JSON.parse(episode.titleI18n).fr;
  console.log(`  ✅ ${title}`);
}

await connection.end();

console.log('\n✅ Épisodes supplémentaires créés avec succès !');
console.log(`\n📊 Résumé:`);
console.log(`   - ${episodes.length} épisodes supplémentaires créés`);
console.log(`\n🎙️ Total des épisodes disponibles: 6`);

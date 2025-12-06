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

console.log('🎧 Seed Épisodes Podcasts - Début...\n');

// Récupérer les IDs des émissions existantes
console.log('📻 Récupération des émissions existantes...');
const [shows] = await connection.execute('SELECT id, slug FROM radioShows ORDER BY id');
console.log(`  ✅ ${shows.length} émissions trouvées\n`);

// Mapper les slugs vers les IDs
const showMap = {};
shows.forEach(show => {
  showMap[show.slug] = show.id;
});

// Créer épisodes podcasts
console.log('🎧 Création des épisodes podcasts...');

const episodes = [
  {
    showSlug: 'waxtan-si-serigne-bi',
    title: 'La patience selon Cheikh Ahmadou Bamba',
    description: 'Réflexion sur la vertu de la patience à travers les écrits de Cheikh Ahmadou Bamba',
    titleI18n: JSON.stringify({
      fr: 'La patience selon Cheikh Ahmadou Bamba',
      ar: 'الصبر حسب الشيخ أحمدو بامبا',
      en: 'Patience according to Cheikh Ahmadou Bamba'
    }),
    descriptionI18n: JSON.stringify({
      fr: 'Réflexion sur la vertu de la patience à travers les écrits et la vie de Cheikh Ahmadou Bamba. Comment cultiver la patience dans notre vie quotidienne.',
      ar: 'تأمل في فضيلة الصبر من خلال كتابات وحياة الشيخ أحمدو بامبا',
      en: 'Reflection on the virtue of patience through the writings and life of Cheikh Ahmadou Bamba.'
    }),
    slug: 'patience-cheikh-ahmadou-bamba',
    audioUrl: 'https://example.com/podcasts/patience.mp3',
    duration: 2400,
    fileSize: 38400000,
    status: 'published',
    publishedAt: new Date('2025-11-25')
  },
  {
    showSlug: 'waxtan-si-khassida-yi',
    title: 'Explication de Jazbul Qulub',
    description: 'Analyse détaillée du célèbre poème Jazbul Qulub',
    titleI18n: JSON.stringify({
      fr: 'Explication de Jazbul Qulub',
      ar: 'شرح جذب القلوب',
      en: 'Explanation of Jazbul Qulub'
    }),
    descriptionI18n: JSON.stringify({
      fr: 'Analyse détaillée du célèbre poème Jazbul Qulub. Signification des vers, contexte de composition et enseignements spirituels.',
      ar: 'تحليل مفصل للقصيدة الشهيرة جذب القلوب. معنى الأبيات وسياق التأليف والتعاليم الروحية',
      en: 'Detailed analysis of the famous poem Jazbul Qulub. Meaning of verses, composition context and spiritual teachings.'
    }),
    slug: 'explication-jazbul-qulub',
    audioUrl: 'https://example.com/podcasts/jazbul-qulub.mp3',
    duration: 3600,
    fileSize: 57600000,
    status: 'published',
    publishedAt: new Date('2025-11-28')
  },
  {
    showSlug: 'questions-de-foi',
    title: 'Comment faire le Wird correctement ?',
    description: 'Guide pratique pour accomplir le Wird mouride',
    titleI18n: JSON.stringify({
      fr: 'Comment faire le Wird correctement ?',
      ar: 'كيف نقوم بالورد بشكل صحيح؟',
      en: 'How to perform the Wird correctly?'
    }),
    descriptionI18n: JSON.stringify({
      fr: 'Guide pratique pour accomplir le Wird mouride. Conditions, prononciation correcte et bénéfices spirituels de cette pratique quotidienne.',
      ar: 'دليل عملي لأداء الورد المريدي. الشروط والنطق الصحيح والفوائد الروحية لهذه الممارسة اليومية',
      en: 'Practical guide to performing the Mouride Wird. Conditions, correct pronunciation and spiritual benefits of this daily practice.'
    }),
    slug: 'comment-faire-wird',
    audioUrl: 'https://example.com/podcasts/wird-guide.mp3',
    duration: 1800,
    fileSize: 28800000,
    status: 'published',
    publishedAt: new Date('2025-12-01')
  },
  {
    showSlug: 'patrimoine-et-tradition',
    title: 'Histoire de la Grande Mosquée de Touba',
    description: 'Récit de la construction de la Grande Mosquée de Touba',
    titleI18n: JSON.stringify({
      fr: 'Histoire de la Grande Mosquée de Touba',
      ar: 'تاريخ المسجد الكبير في طوبى',
      en: 'History of the Great Mosque of Touba'
    }),
    descriptionI18n: JSON.stringify({
      fr: 'Récit de la construction de la Grande Mosquée de Touba, de sa conception par Cheikh Ahmadou Bamba à son achèvement. Architecture et symbolisme.',
      ar: 'قصة بناء المسجد الكبير في طوبى من تصميمه من قبل الشيخ أحمدو بامبا إلى إتمامه',
      en: 'Story of the construction of the Great Mosque of Touba, from its design by Cheikh Ahmadou Bamba to its completion.'
    }),
    slug: 'histoire-mosquee-touba',
    audioUrl: 'https://example.com/podcasts/mosquee-touba.mp3',
    duration: 2700,
    fileSize: 43200000,
    status: 'published',
    publishedAt: new Date('2025-12-03')
  },
  {
    showSlug: 'khassaides-du-matin',
    title: 'Récitation matinale - Matlabul Fawzayni',
    description: 'Récitation chantée du Matlabul Fawzayni pour commencer la journée',
    titleI18n: JSON.stringify({
      fr: 'Récitation matinale - Matlabul Fawzayni',
      ar: 'تلاوة الصباح - مطلب الفوزين',
      en: 'Morning recitation - Matlabul Fawzayni'
    }),
    descriptionI18n: JSON.stringify({
      fr: 'Récitation chantée du Matlabul Fawzayni pour commencer la journée dans la spiritualité. Voix mélodieuses et ambiance méditative.',
      ar: 'تلاوة منشدة لمطلب الفوزين لبدء اليوم في الروحانية',
      en: 'Sung recitation of Matlabul Fawzayni to start the day in spirituality. Melodious voices and meditative atmosphere.'
    }),
    slug: 'recitation-matlabul-fawzayni',
    audioUrl: 'https://example.com/podcasts/matlabul-fawzayni.mp3',
    duration: 1200,
    fileSize: 19200000,
    status: 'published',
    publishedAt: new Date('2025-12-05')
  },
  {
    showSlug: 'actualites-communautaires',
    title: 'Préparatifs du Grand Magal 2025',
    description: 'Point sur les préparatifs du Grand Magal de Touba 2025',
    titleI18n: JSON.stringify({
      fr: 'Préparatifs du Grand Magal 2025',
      ar: 'استعدادات المولد الكبير 2025',
      en: 'Preparations for the Grand Magal 2025'
    }),
    descriptionI18n: JSON.stringify({
      fr: 'Point sur les préparatifs du Grand Magal de Touba 2025. Infrastructures, accueil des pèlerins, programme des cérémonies.',
      ar: 'نقطة حول استعدادات المولد الكبير في طوبى 2025. البنية التحتية واستقبال الحجاج وبرنامج الاحتفالات',
      en: 'Update on preparations for the Grand Magal of Touba 2025. Infrastructure, pilgrim reception, ceremony program.'
    }),
    slug: 'preparatifs-magal-2025',
    audioUrl: 'https://example.com/podcasts/magal-2025.mp3',
    duration: 1500,
    fileSize: 24000000,
    status: 'published',
    publishedAt: new Date('2025-12-06')
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

console.log('\n✅ Seed Épisodes terminé avec succès !');
console.log(`\n📊 Résumé:`);
console.log(`   - ${episodes.length} épisodes podcasts créés`);
console.log(`\n🎙️ Vous pouvez maintenant tester:`);
console.log(`   - /radio (home avec derniers podcasts)`);
console.log(`   - /radio/podcasts (liste complète des replays)`);

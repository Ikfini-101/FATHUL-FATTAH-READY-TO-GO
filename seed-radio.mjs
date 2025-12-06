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

console.log('🎙️ Seed E-Radio - Début...\n');

// 1. Créer émissions
console.log('📻 Création des émissions...');

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const shows = [
  {
    title: 'Waxtan si Serigne Bi',
    slug: 'waxtan-si-serigne-bi',
    description: 'Émission quotidienne consacrée aux enseignements de Cheikh Ahmadou Bamba',
    titleI18n: JSON.stringify({
      fr: 'Waxtan si Serigne Bi',
      ar: 'حديث عن الشيخ',
      en: 'Talk about the Sheikh'
    }),
    descriptionI18n: JSON.stringify({
      fr: 'Émission quotidienne consacrée aux enseignements de Cheikh Ahmadou Bamba. Réflexions spirituelles, récits historiques et guidance pour les disciples mourides.',
      ar: 'برنامج يومي مخصص لتعاليم الشيخ أحمدو بامبا. تأملات روحية وقصص تاريخية وإرشادات للمريدين',
      en: 'Daily show dedicated to the teachings of Cheikh Ahmadou Bamba. Spiritual reflections, historical narratives and guidance for Mouride disciples.'
    }),
    category: 'spiritualite',
    status: 'published',
    hostName: 'Serigne Moustapha Mbacké',
    imageUrl: '/images/cheikh-bamba.jpeg'
  },
  {
    title: 'Waxtan si Khassida Yi',
    slug: 'waxtan-si-khassida-yi',
    description: 'Étude approfondie des Khassaides de Cheikh Ahmadou Bamba',
    titleI18n: JSON.stringify({
      fr: 'Waxtan si Khassida Yi',
      ar: 'حديث عن القصائد',
      en: 'Talk about the Khassaides'
    }),
    descriptionI18n: JSON.stringify({
      fr: 'Étude approfondie des Khassaides (poèmes spirituels) de Cheikh Ahmadou Bamba. Explication des vers, contexte historique et signification spirituelle.',
      ar: 'دراسة متعمقة للقصائد الروحية للشيخ أحمدو بامبا. شرح الأبيات والسياق التاريخي والمعنى الروحي',
      en: 'In-depth study of the Khassaides (spiritual poems) of Cheikh Ahmadou Bamba. Verse explanation, historical context and spiritual meaning.'
    }),
    category: 'culture',
    status: 'published',
    hostName: 'Serigne Abdou Aziz Sy',
    imageUrl: '/images/touba-mosque-1.jpg'
  },
  {
    title: 'Questions de Foi',
    slug: 'questions-de-foi',
    description: 'Réponses aux questions des auditeurs sur la pratique religieuse',
    titleI18n: JSON.stringify({
      fr: 'Questions de Foi',
      ar: 'أسئلة الإيمان',
      en: 'Questions of Faith'
    }),
    descriptionI18n: JSON.stringify({
      fr: 'Réponses aux questions des auditeurs sur la pratique religieuse, la spiritualité mouride et les enseignements islamiques. Émission interactive et pédagogique.',
      ar: 'إجابات على أسئلة المستمعين حول الممارسة الدينية والروحانية المريدية والتعاليم الإسلامية',
      en: 'Answers to listeners\' questions about religious practice, Mouride spirituality and Islamic teachings. Interactive and educational show.'
    }),
    category: 'education',
    status: 'published',
    hostName: 'Imam Cheikh Tidiane Fall',
    imageUrl: '/images/touba-mosque-2.jpg'
  },
  {
    title: 'Patrimoine et Tradition',
    slug: 'patrimoine-et-tradition',
    description: 'Découverte du patrimoine culturel sénégalais et des traditions mourides',
    titleI18n: JSON.stringify({
      fr: 'Patrimoine et Tradition',
      ar: 'التراث والتقاليد',
      en: 'Heritage and Tradition'
    }),
    descriptionI18n: JSON.stringify({
      fr: 'Découverte du patrimoine culturel sénégalais et des traditions mourides. Histoire de Touba, artisanat, musique religieuse et témoignages.',
      ar: 'اكتشاف التراث الثقافي السنغالي والتقاليد المريدية. تاريخ طوبى والحرف اليدوية والموسيقى الدينية',
      en: 'Discovery of Senegalese cultural heritage and Mouride traditions. History of Touba, crafts, religious music and testimonies.'
    }),
    category: 'culture',
    status: 'published',
    hostName: 'Fatou Diop',
    imageUrl: '/images/touba-mosque-3.jpg'
  },
  {
    title: 'Khassaides du Matin',
    slug: 'khassaides-du-matin',
    description: 'Récitation et chant des Khassaides pour bien commencer la journée',
    titleI18n: JSON.stringify({
      fr: 'Khassaides du Matin',
      ar: 'قصائد الصباح',
      en: 'Morning Khassaides'
    }),
    descriptionI18n: JSON.stringify({
      fr: 'Récitation et chant des Khassaides pour bien commencer la journée. Ambiance méditative et spirituelle pour éveiller l\'âme.',
      ar: 'تلاوة وإنشاد القصائد لبداية يوم جيد. أجواء تأملية وروحية لإيقاظ الروح',
      en: 'Recitation and singing of Khassaides to start the day well. Meditative and spiritual atmosphere to awaken the soul.'
    }),
    category: 'spiritualite',
    status: 'published',
    hostName: 'Groupe Dahiratoul Moustarchidine',
    imageUrl: '/images/ramadan-fr.png'
  },
  {
    title: 'Actualités Communautaires',
    slug: 'actualites-communautaires',
    description: 'Informations sur les événements de la communauté mouride',
    titleI18n: JSON.stringify({
      fr: 'Actualités Communautaires',
      ar: 'أخبار المجتمع',
      en: 'Community News'
    }),
    descriptionI18n: JSON.stringify({
      fr: 'Informations sur les événements de la communauté mouride : Magal, ziarra, conférences, projets sociaux et annonces importantes.',
      ar: 'معلومات عن أحداث المجتمع المريدي: المولد والزيارات والمؤتمرات والمشاريع الاجتماعية',
      en: 'Information on Mouride community events: Magal, ziarra, conferences, social projects and important announcements.'
    }),
    category: 'actualites',
    status: 'published',
    hostName: 'Amadou Pouye',
    imageUrl: '/images/ramadan-ar.png'
  }
];

const showIds = [];
for (const show of shows) {
  const [result] = await connection.execute(
    `INSERT INTO radioShows (title, slug, description, titleI18n, descriptionI18n, category, status, hostName, imageUrl, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [show.title, show.slug, show.description, show.titleI18n, show.descriptionI18n, show.category, show.status, show.hostName, show.imageUrl]
  );
  showIds.push(result.insertId);
  const title = JSON.parse(show.titleI18n).fr;
  console.log(`  ✅ ${title} (ID: ${result.insertId})`);
}

// 2. Créer grille horaire hebdomadaire
console.log('\n📅 Création de la grille horaire...');

const schedule = [
  // Lundi
  { showId: showIds[4], dayOfWeek: 1, startTime: '06:00', endTime: '07:00', isRecurring: true }, // Khassaides du Matin
  { showId: showIds[0], dayOfWeek: 1, startTime: '09:00', endTime: '10:00', isRecurring: true }, // Waxtan si Serigne Bi
  { showId: showIds[2], dayOfWeek: 1, startTime: '14:00', endTime: '15:00', isRecurring: true }, // Questions de Foi
  { showId: showIds[5], dayOfWeek: 1, startTime: '19:00', endTime: '20:00', isRecurring: true }, // Actualités
  
  // Mardi
  { showId: showIds[4], dayOfWeek: 2, startTime: '06:00', endTime: '07:00', isRecurring: true },
  { showId: showIds[1], dayOfWeek: 2, startTime: '09:00', endTime: '10:30', isRecurring: true }, // Waxtan si Khassida Yi
  { showId: showIds[3], dayOfWeek: 2, startTime: '15:00', endTime: '16:00', isRecurring: true }, // Patrimoine
  
  // Mercredi
  { showId: showIds[4], dayOfWeek: 3, startTime: '06:00', endTime: '07:00', isRecurring: true },
  { showId: showIds[0], dayOfWeek: 3, startTime: '09:00', endTime: '10:00', isRecurring: true },
  { showId: showIds[2], dayOfWeek: 3, startTime: '14:00', endTime: '15:00', isRecurring: true },
  
  // Jeudi
  { showId: showIds[4], dayOfWeek: 4, startTime: '06:00', endTime: '07:00', isRecurring: true },
  { showId: showIds[1], dayOfWeek: 4, startTime: '09:00', endTime: '10:30', isRecurring: true },
  { showId: showIds[3], dayOfWeek: 4, startTime: '15:00', endTime: '16:00', isRecurring: true },
  { showId: showIds[5], dayOfWeek: 4, startTime: '19:00', endTime: '20:00', isRecurring: true },
  
  // Vendredi
  { showId: showIds[4], dayOfWeek: 5, startTime: '06:00', endTime: '07:00', isRecurring: true },
  { showId: showIds[0], dayOfWeek: 5, startTime: '09:00', endTime: '10:00', isRecurring: true },
  { showId: showIds[2], dayOfWeek: 5, startTime: '16:00', endTime: '17:30', isRecurring: true }, // Spécial vendredi
  
  // Samedi
  { showId: showIds[4], dayOfWeek: 6, startTime: '06:00', endTime: '07:00', isRecurring: true },
  { showId: showIds[3], dayOfWeek: 6, startTime: '10:00', endTime: '12:00', isRecurring: true }, // Spécial patrimoine
  { showId: showIds[1], dayOfWeek: 6, startTime: '15:00', endTime: '17:00', isRecurring: true },
  
  // Dimanche
  { showId: showIds[4], dayOfWeek: 0, startTime: '06:00', endTime: '07:00', isRecurring: true },
  { showId: showIds[0], dayOfWeek: 0, startTime: '09:00', endTime: '11:00', isRecurring: true }, // Spécial dimanche
  { showId: showIds[5], dayOfWeek: 0, startTime: '18:00', endTime: '19:00', isRecurring: true }
];

for (const slot of schedule) {
  await connection.execute(
    `INSERT INTO radioSchedule (showId, dayOfWeek, startTime, endTime, isRecurring, timezone, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, 'Africa/Dakar', NOW(), NOW())`,
    [slot.showId, slot.dayOfWeek, slot.startTime, slot.endTime, slot.isRecurring]
  );
}
console.log(`  ✅ ${schedule.length} créneaux horaires créés`);

// 3. Créer épisodes podcasts
console.log('\n🎧 Création des épisodes podcasts...');

const episodes = [
  {
    showId: showIds[0],
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
    showId: showIds[1],
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
    showId: showIds[2],
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
    showId: showIds[3],
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
    showId: showIds[4],
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
    showId: showIds[5],
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
  await connection.execute(
    `INSERT INTO radioEpisodes (showId, title, description, titleI18n, descriptionI18n, slug, audioUrl, duration, fileSize, status, publishedAt, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [episode.showId, episode.title, episode.description, episode.titleI18n, episode.descriptionI18n, episode.slug, episode.audioUrl, episode.duration, episode.fileSize, episode.status, episode.publishedAt]
  );
  const title = JSON.parse(episode.titleI18n).fr;
  console.log(`  ✅ ${title}`);
}

await connection.end();

console.log('\n✅ Seed E-Radio terminé avec succès !');
console.log(`\n📊 Résumé:`);
console.log(`   - ${shows.length} émissions créées`);
console.log(`   - ${schedule.length} créneaux horaires`);
console.log(`   - ${episodes.length} épisodes podcasts`);
console.log(`\n🎙️ Vous pouvez maintenant tester:`);
console.log(`   - /radio (home avec émissions vedettes)`);
console.log(`   - /radio/grille (programme hebdomadaire)`);
console.log(`   - /radio/podcasts (liste des replays)`);

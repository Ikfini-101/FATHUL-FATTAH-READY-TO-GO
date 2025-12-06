import mysql from 'mysql2/promise';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('🎙️ Seed E-Radio avec noms Mourides authentiques...\n');

// ========================================
// 1. ÉMISSIONS RADIO (6 émissions)
// ========================================

const shows = [
  {
    slug: 'waxtan-si-serigne-bi',
    title: 'Waxtan si Serigne Bi',
    titleI18n: JSON.stringify({
      fr: 'Paroles sur le Cheikh',
      ar: 'كلام عن الشيخ',
      en: 'Words about the Sheikh'
    }),
    description: 'Émission quotidienne consacrée aux enseignements et à la vie de Cheikh Ahmadou Bamba',
    descriptionI18n: JSON.stringify({
      fr: 'Émission quotidienne consacrée aux enseignements et à la vie de Cheikh Ahmadou Bamba, animée par Ganna Messere',
      ar: 'برنامج يومي مخصص لتعاليم وحياة الشيخ أحمدو بامبا، يقدمه جانا ميسيري',
      en: 'Daily program dedicated to the teachings and life of Cheikh Ahmadou Bamba, hosted by Ganna Messere'
    }),
    hostName: 'Ganna Messere',
    imageUrl: '/images/touba-mosque-1.jpg',
    category: 'Enseignements',
    status: 'published'
  },
  {
    slug: 'waxtan-si-khassida-yi',
    title: 'Waxtan si Khassida Yi',
    titleI18n: JSON.stringify({
      fr: 'Paroles sur les Khassaides',
      ar: 'كلام عن القصائد',
      en: 'Words about the Qasidas'
    }),
    description: 'Étude approfondie des Khassaides de Serigne Touba',
    descriptionI18n: JSON.stringify({
      fr: 'Étude approfondie et commentaires des Khassaides (poèmes spirituels) de Serigne Touba, animée par Serigne Saliou Samb',
      ar: 'دراسة متعمقة وتعليقات على القصائد الروحية للشيخ أحمدو بامبا، يقدمها سيرين ساليو سامب',
      en: 'In-depth study and commentary on the Qasidas (spiritual poems) of Serigne Touba, hosted by Serigne Saliou Samb'
    }),
    hostName: 'Serigne Saliou Samb',
    imageUrl: '/images/touba-mosque-2.jpg',
    category: 'Khassaides',
    status: 'published'
  },
  {
    slug: 'tariqa-mouride',
    title: 'Tariqa Mouride',
    titleI18n: JSON.stringify({
      fr: 'La Voie Mouride',
      ar: 'الطريقة المريدية',
      en: 'The Mouride Path'
    }),
    description: 'Exploration de la voie spirituelle Mouride',
    descriptionI18n: JSON.stringify({
      fr: 'Exploration de la voie spirituelle Mouride, ses principes et pratiques, animée par Abdoulaye Diop Bichri',
      ar: 'استكشاف الطريقة الروحية المريدية ومبادئها وممارساتها، يقدمه عبد الله ديوب بيشري',
      en: 'Exploration of the Mouride spiritual path, its principles and practices, hosted by Abdoulaye Diop Bichri'
    }),
    hostName: 'Abdoulaye Diop Bichri',
    imageUrl: '/images/touba-mosque-3.jpg',
    category: 'Spiritualité',
    status: 'published'
  },
  {
    slug: 'khassaides-du-matin',
    title: 'Khassaides du Matin',
    titleI18n: JSON.stringify({
      fr: 'Khassaides du Matin',
      ar: 'قصائد الصباح',
      en: 'Morning Qasidas'
    }),
    description: 'Récitation et explication des Khassaides au lever du jour',
    descriptionI18n: JSON.stringify({
      fr: 'Récitation et explication des Khassaides de Serigne Touba au lever du jour, animée par Ganna Messere',
      ar: 'تلاوة وشرح قصائد الشيخ أحمدو بامبا عند الفجر، يقدمها جانا ميسيري',
      en: 'Recitation and explanation of Serigne Touba\'s Qasidas at dawn, hosted by Ganna Messere'
    }),
    hostName: 'Ganna Messere',
    imageUrl: '/images/cheikh-bamba.jpeg',
    category: 'Khassaides',
    status: 'published'
  },
  {
    slug: 'histoire-mouridisme',
    title: 'Histoire du Mouridisme',
    titleI18n: JSON.stringify({
      fr: 'Histoire du Mouridisme',
      ar: 'تاريخ المريدية',
      en: 'History of Mouridism'
    }),
    description: 'Récits historiques sur la confrérie Mouride',
    descriptionI18n: JSON.stringify({
      fr: 'Récits historiques sur la confrérie Mouride, de sa fondation à nos jours, animée par Serigne Saliou Samb',
      ar: 'روايات تاريخية عن الطريقة المريدية من تأسيسها إلى يومنا هذا، يقدمها سيرين ساليو سامب',
      en: 'Historical accounts of the Mouride brotherhood, from its foundation to today, hosted by Serigne Saliou Samb'
    }),
    hostName: 'Serigne Saliou Samb',
    imageUrl: '/images/touba-mosque-1.jpg',
    category: 'Histoire',
    status: 'published'
  },
  {
    slug: 'questions-de-foi',
    title: 'Questions de Foi',
    titleI18n: JSON.stringify({
      fr: 'Questions de Foi',
      ar: 'أسئلة الإيمان',
      en: 'Questions of Faith'
    }),
    description: 'Réponses aux questions spirituelles selon l\'enseignement Mouride',
    descriptionI18n: JSON.stringify({
      fr: 'Réponses aux questions spirituelles des auditeurs selon l\'enseignement de Serigne Touba, animée par Abdoulaye Diop Bichri',
      ar: 'إجابات على الأسئلة الروحية للمستمعين وفقًا لتعاليم الشيخ أحمدو بامبا، يقدمه عبد الله ديوب بيشري',
      en: 'Answers to listeners\' spiritual questions according to Serigne Touba\'s teachings, hosted by Abdoulaye Diop Bichri'
    }),
    hostName: 'Abdoulaye Diop Bichri',
    imageUrl: '/images/cheikh-bamba-portrait.png',
    category: 'Questions-Réponses',
    status: 'published'
  }
];

console.log('📻 Création des émissions...');
for (const show of shows) {
  const [result] = await connection.execute(
    `INSERT INTO radioShows (slug, title, titleI18n, description, descriptionI18n, hostName, imageUrl, category, status, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [show.slug, show.title, show.titleI18n, show.description, show.descriptionI18n, show.hostName, show.imageUrl, show.category, show.status]
  );
  console.log(`  ✓ ${show.title} (animée par ${show.hostName})`);
}

// ========================================
// 2. GRILLE HORAIRE (Programme hebdomadaire)
// ========================================

console.log('\n📅 Création de la grille horaire...');

// Récupérer les IDs des émissions
const [showsData] = await connection.execute('SELECT id, slug FROM radioShows');
const showsMap = Object.fromEntries(showsData.map(s => [s.slug, s.id]));

const schedule = [
  // Lundi
  { showId: showsMap['khassaides-du-matin'], dayOfWeek: 1, startTime: '06:00', endTime: '07:00', isRecurring: true },
  { showId: showsMap['waxtan-si-serigne-bi'], dayOfWeek: 1, startTime: '09:00', endTime: '10:00', isRecurring: true },
  { showId: showsMap['tariqa-mouride'], dayOfWeek: 1, startTime: '15:00', endTime: '16:00', isRecurring: true },
  { showId: showsMap['questions-de-foi'], dayOfWeek: 1, startTime: '20:00', endTime: '21:00', isRecurring: true },
  
  // Mardi
  { showId: showsMap['khassaides-du-matin'], dayOfWeek: 2, startTime: '06:00', endTime: '07:00', isRecurring: true },
  { showId: showsMap['waxtan-si-khassida-yi'], dayOfWeek: 2, startTime: '09:00', endTime: '10:00', isRecurring: true },
  { showId: showsMap['histoire-mouridisme'], dayOfWeek: 2, startTime: '15:00', endTime: '16:00', isRecurring: true },
  { showId: showsMap['waxtan-si-serigne-bi'], dayOfWeek: 2, startTime: '20:00', endTime: '21:00', isRecurring: true },
  
  // Mercredi
  { showId: showsMap['khassaides-du-matin'], dayOfWeek: 3, startTime: '06:00', endTime: '07:00', isRecurring: true },
  { showId: showsMap['tariqa-mouride'], dayOfWeek: 3, startTime: '09:00', endTime: '10:00', isRecurring: true },
  { showId: showsMap['waxtan-si-khassida-yi'], dayOfWeek: 3, startTime: '15:00', endTime: '16:00', isRecurring: true },
  { showId: showsMap['questions-de-foi'], dayOfWeek: 3, startTime: '20:00', endTime: '21:00', isRecurring: true },
  
  // Jeudi
  { showId: showsMap['khassaides-du-matin'], dayOfWeek: 4, startTime: '06:00', endTime: '07:00', isRecurring: true },
  { showId: showsMap['waxtan-si-serigne-bi'], dayOfWeek: 4, startTime: '09:00', endTime: '10:00', isRecurring: true },
  { showId: showsMap['histoire-mouridisme'], dayOfWeek: 4, startTime: '15:00', endTime: '16:00', isRecurring: true },
  { showId: showsMap['tariqa-mouride'], dayOfWeek: 4, startTime: '20:00', endTime: '21:00', isRecurring: true },
  
  // Vendredi (jour spécial)
  { showId: showsMap['khassaides-du-matin'], dayOfWeek: 5, startTime: '06:00', endTime: '07:00', isRecurring: true },
  { showId: showsMap['waxtan-si-khassida-yi'], dayOfWeek: 5, startTime: '09:00', endTime: '11:00', isRecurring: true },
  { showId: showsMap['questions-de-foi'], dayOfWeek: 5, startTime: '15:00', endTime: '17:00', isRecurring: true },
  
  // Samedi
  { showId: showsMap['khassaides-du-matin'], dayOfWeek: 6, startTime: '06:00', endTime: '07:00', isRecurring: true },
  { showId: showsMap['histoire-mouridisme'], dayOfWeek: 6, startTime: '09:00', endTime: '10:00', isRecurring: true },
  { showId: showsMap['waxtan-si-serigne-bi'], dayOfWeek: 6, startTime: '15:00', endTime: '16:00', isRecurring: true },
  
  // Dimanche
  { showId: showsMap['khassaides-du-matin'], dayOfWeek: 0, startTime: '06:00', endTime: '07:00', isRecurring: true },
  { showId: showsMap['tariqa-mouride'], dayOfWeek: 0, startTime: '09:00', endTime: '10:00', isRecurring: true },
  { showId: showsMap['waxtan-si-khassida-yi'], dayOfWeek: 0, startTime: '15:00', endTime: '16:00', isRecurring: true },
];

for (const slot of schedule) {
  await connection.execute(
    `INSERT INTO radioSchedule (showId, dayOfWeek, startTime, endTime, timezone, isRecurring, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, 'Africa/Dakar', ?, NOW(), NOW())`,
    [slot.showId, slot.dayOfWeek, slot.startTime, slot.endTime, slot.isRecurring]
  );
}

console.log(`  ✓ ${schedule.length} créneaux horaires créés`);

console.log('\n✅ Seed E-Radio Mouride terminé !');
console.log(`   - ${shows.length} émissions créées`);
console.log(`   - ${schedule.length} créneaux horaires planifiés`);

await connection.end();

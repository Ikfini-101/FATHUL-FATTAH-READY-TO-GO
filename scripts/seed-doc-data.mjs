import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

// Données de démonstration contextuelles Mouridisme/Hizbut Tarquiyyah
const documents = [
  {
    title_i18n: JSON.stringify({
      fr: "Khassaïde Matlabul Fawzayni - Manuscrit Original",
      ar: "قصيدة مطلب الفوزين - المخطوطة الأصلية",
      en: "Khassaïde Matlabul Fawzayni - Original Manuscript"
    }),
    description_i18n: JSON.stringify({
      fr: "Manuscrit original de la célèbre khassaïde Matlabul Fawzayni (La quête des deux félicités) composée par Cheikh Ahmadou Bamba. Ce poème mystique explore les dimensions spirituelles et temporelles de la félicité.",
      ar: "المخطوطة الأصلية للقصيدة الشهيرة مطلب الفوزين التي ألفها الشيخ أحمدو بامبا. تستكشف هذه القصيدة الصوفية الأبعاد الروحية والزمنية للسعادة.",
      en: "Original manuscript of the famous khassaïde Matlabul Fawzayni (The Quest for Two Felicities) composed by Cheikh Ahmadou Bamba. This mystical poem explores the spiritual and temporal dimensions of felicity."
    }),
    slug: "khassaide-matlabul-fawzayni-manuscrit",
    type: "manuscript",
    creator: "Cheikh Ahmadou Bamba Mbacké",
    date: "1895-01-01",
    language: "ar",
    status: "published"
  },
  {
    title_i18n: JSON.stringify({
      fr: "Massalikul Jinaan - Le Chemin du Paradis",
      ar: "مسالك الجنان - طريق الجنة",
      en: "Massalikul Jinaan - The Path to Paradise"
    }),
    description_i18n: JSON.stringify({
      fr: "Œuvre majeure de Cheikh Ahmadou Bamba décrivant les chemins spirituels menant au paradis. Manuscrit enluminé avec calligraphie arabe traditionnelle.",
      ar: "عمل رئيسي للشيخ أحمدو بامبا يصف الطرق الروحية المؤدية إلى الجنة. مخطوطة مزخرفة بالخط العربي التقليدي.",
      en: "Major work by Cheikh Ahmadou Bamba describing the spiritual paths leading to paradise. Illuminated manuscript with traditional Arabic calligraphy."
    }),
    slug: "massalikul-jinaan-chemin-paradis",
    type: "manuscript",
    creator: "Cheikh Ahmadou Bamba Mbacké",
    date: "1902-06-15",
    language: "ar",
    status: "published"
  },
  {
    title_i18n: JSON.stringify({
      fr: "Histoire du Mouridisme - Tome I",
      ar: "تاريخ المريدية - المجلد الأول",
      en: "History of Mouridism - Volume I"
    }),
    description_i18n: JSON.stringify({
      fr: "Étude historique complète sur les origines et le développement de la confrérie Mouride au Sénégal, de sa fondation par Cheikh Ahmadou Bamba jusqu'au début du XXe siècle.",
      ar: "دراسة تاريخية شاملة عن أصول وتطور الطريقة المريدية في السنغال، من تأسيسها على يد الشيخ أحمدو بامبا حتى بداية القرن العشرين.",
      en: "Comprehensive historical study on the origins and development of the Mouride brotherhood in Senegal, from its foundation by Cheikh Ahmadou Bamba to the early 20th century."
    }),
    slug: "histoire-mouridisme-tome-1",
    type: "book",
    creator: "Serigne Bassirou Mbacké",
    date: "1975-03-20",
    language: "fr",
    status: "published"
  },
  {
    title_i18n: JSON.stringify({
      fr: "Recueil de Khassaïdes - Édition Annotée",
      ar: "مجموعة القصائد - طبعة مشروحة",
      en: "Collection of Khassaïdes - Annotated Edition"
    }),
    description_i18n: JSON.stringify({
      fr: "Compilation annotée de 50 khassaïdes majeures de Cheikh Ahmadou Bamba avec traductions en français et commentaires explicatifs. Édition critique établie par l'Université CCAK.",
      ar: "مجموعة مشروحة من 50 قصيدة رئيسية للشيخ أحمدو بامبا مع ترجمات فرنسية وتعليقات توضيحية. طبعة نقدية أعدتها جامعة CCAK.",
      en: "Annotated compilation of 50 major khassaïdes by Cheikh Ahmadou Bamba with French translations and explanatory comments. Critical edition established by CCAK University."
    }),
    slug: "recueil-khassaides-edition-annotee",
    type: "book",
    creator: "Université CCAK (éd.)",
    date: "2018-11-05",
    language: "fr",
    status: "published"
  },
  {
    title_i18n: JSON.stringify({
      fr: "Le Soufisme dans la Tradition Mouride",
      ar: "التصوف في التقليد المريدي",
      en: "Sufism in the Mouride Tradition"
    }),
    description_i18n: JSON.stringify({
      fr: "Thèse de doctorat analysant les dimensions soufies de l'enseignement de Cheikh Ahmadou Bamba et leur inscription dans la tradition mystique islamique.",
      ar: "أطروحة دكتوراه تحلل الأبعاد الصوفية لتعاليم الشيخ أحمدو بامبا وارتباطها بالتقليد الصوفي الإسلامي.",
      en: "Doctoral thesis analyzing the Sufi dimensions of Cheikh Ahmadou Bamba's teachings and their place in the Islamic mystical tradition."
    }),
    slug: "soufisme-tradition-mouride-these",
    type: "thesis",
    creator: "Dr. Fatou Diop",
    date: "2020-06-30",
    language: "fr",
    status: "published"
  },
  {
    title_i18n: JSON.stringify({
      fr: "Jawahirul Ma'ani - Les Joyaux des Significations",
      ar: "جواهر المعاني - جواهر المعاني",
      en: "Jawahirul Ma'ani - The Jewels of Meanings"
    }),
    description_i18n: JSON.stringify({
      fr: "Commentaire spirituel majeur sur les noms divins et leurs significations ésotériques selon l'enseignement de Cheikh Ahmadou Bamba.",
      ar: "تعليق روحي رئيسي على الأسماء الإلهية ومعانيها الباطنية وفقًا لتعاليم الشيخ أحمدو بامبا.",
      en: "Major spiritual commentary on the divine names and their esoteric meanings according to Cheikh Ahmadou Bamba's teaching."
    }),
    slug: "jawahirul-maani-joyaux-significations",
    type: "manuscript",
    creator: "Cheikh Ahmadou Bamba Mbacké",
    date: "1910-08-12",
    language: "ar",
    status: "published"
  },
  {
    title_i18n: JSON.stringify({
      fr: "Architecture Sacrée de la Grande Mosquée de Touba",
      ar: "العمارة المقدسة للمسجد الكبير في طوبى",
      en: "Sacred Architecture of the Great Mosque of Touba"
    }),
    description_i18n: JSON.stringify({
      fr: "Étude architecturale et symbolique de la Grande Mosquée de Touba, incluant plans, photographies et analyse des éléments décoratifs.",
      ar: "دراسة معمارية ورمزية للمسجد الكبير في طوبى، بما في ذلك المخططات والصور وتحليل العناصر الزخرفية.",
      en: "Architectural and symbolic study of the Great Mosque of Touba, including plans, photographs and analysis of decorative elements."
    }),
    slug: "architecture-sacree-mosquee-touba",
    type: "report",
    creator: "Musée de Touba",
    date: "2015-12-01",
    language: "fr",
    status: "published"
  },
  {
    title_i18n: JSON.stringify({
      fr: "Hizbut Tarquiyyah - Principes et Pratiques",
      ar: "حزب الترقية - المبادئ والممارسات",
      en: "Hizbut Tarquiyyah - Principles and Practices"
    }),
    description_i18n: JSON.stringify({
      fr: "Guide complet sur les principes fondamentaux et les pratiques quotidiennes de Hizbut Tarquiyyah, mouvement de renouveau spirituel fondé par Cheikh Ahmadou Bamba.",
      ar: "دليل شامل عن المبادئ الأساسية والممارسات اليومية لحزب الترقية، حركة التجديد الروحي التي أسسها الشيخ أحمدو بامبا.",
      en: "Comprehensive guide on the fundamental principles and daily practices of Hizbut Tarquiyyah, spiritual renewal movement founded by Cheikh Ahmadou Bamba."
    }),
    slug: "hizbut-tarquiyyah-principes-pratiques",
    type: "book",
    creator: "Serigne Touba Mbacké",
    date: "2010-04-15",
    language: "fr",
    status: "published"
  },
  {
    title_i18n: JSON.stringify({
      fr: "Enregistrement Audio - Récitation de Khassaïdes",
      ar: "تسجيل صوتي - تلاوة القصائد",
      en: "Audio Recording - Khassaïdes Recitation"
    }),
    description_i18n: JSON.stringify({
      fr: "Enregistrement audio de la récitation traditionnelle de khassaïdes lors du Grand Magal de Touba 2023. Voix de Serigne Modou Kara Mbacké.",
      ar: "تسجيل صوتي لتلاوة القصائد التقليدية خلال المولد الكبير في طوبى 2023. صوت سيرين مودو كارا مباكي.",
      en: "Audio recording of traditional khassaïdes recitation during the Grand Magal of Touba 2023. Voice of Serigne Modou Kara Mbacké."
    }),
    slug: "audio-recitation-khassaides-magal-2023",
    type: "audio",
    creator: "Serigne Modou Kara Mbacké",
    date: "2023-10-02",
    language: "ar",
    status: "published"
  },
  {
    title_i18n: JSON.stringify({
      fr: "La Philosophie du Travail selon Cheikh Ahmadou Bamba",
      ar: "فلسفة العمل عند الشيخ أحمدو بامبا",
      en: "The Philosophy of Work according to Cheikh Ahmadou Bamba"
    }),
    description_i18n: JSON.stringify({
      fr: "Article académique analysant la conception du travail comme acte d'adoration dans l'enseignement de Cheikh Ahmadou Bamba et son impact sur la société mouride.",
      ar: "مقال أكاديمي يحلل مفهوم العمل كعبادة في تعاليم الشيخ أحمدو بامبا وتأثيره على المجتمع المريدي.",
      en: "Academic article analyzing the conception of work as an act of worship in Cheikh Ahmadou Bamba's teaching and its impact on Mouride society."
    }),
    slug: "philosophie-travail-cheikh-ahmadou-bamba",
    type: "article",
    creator: "Prof. Mamadou Diouf",
    date: "2019-03-10",
    language: "fr",
    status: "published"
  },
  {
    title_i18n: JSON.stringify({
      fr: "Calligraphie Arabe - Œuvres de Cheikh Ahmadou Bamba",
      ar: "الخط العربي - أعمال الشيخ أحمدو بامبا",
      en: "Arabic Calligraphy - Works of Cheikh Ahmadou Bamba"
    }),
    description_i18n: JSON.stringify({
      fr: "Collection d'images haute résolution de calligraphies arabes réalisées par Cheikh Ahmadou Bamba, incluant des versets coraniques et des invocations.",
      ar: "مجموعة صور عالية الدقة للخطوط العربية التي كتبها الشيخ أحمدو بامبا، بما في ذلك الآيات القرآنية والأدعية.",
      en: "High-resolution image collection of Arabic calligraphies created by Cheikh Ahmadou Bamba, including Quranic verses and invocations."
    }),
    slug: "calligraphie-arabe-oeuvres-cheikh-bamba",
    type: "image",
    creator: "Cheikh Ahmadou Bamba Mbacké",
    date: "1900-01-01",
    language: "ar",
    status: "published"
  },
  {
    title_i18n: JSON.stringify({
      fr: "L'Éducation Spirituelle dans le Mouridisme",
      ar: "التربية الروحية في المريدية",
      en: "Spiritual Education in Mouridism"
    }),
    description_i18n: JSON.stringify({
      fr: "Thèse de Master sur les méthodes pédagogiques et les étapes de l'éducation spirituelle dans la tradition mouride, basée sur les enseignements de Cheikh Ahmadou Bamba.",
      ar: "رسالة ماجستير عن الأساليب التربوية ومراحل التربية الروحية في التقليد المريدي، بناءً على تعاليم الشيخ أحمدو بامبا.",
      en: "Master's thesis on pedagogical methods and stages of spiritual education in the Mouride tradition, based on Cheikh Ahmadou Bamba's teachings."
    }),
    slug: "education-spirituelle-mouridisme-these",
    type: "thesis",
    creator: "Aminata Sow",
    date: "2021-09-15",
    language: "fr",
    status: "published"
  },
  {
    title_i18n: JSON.stringify({
      fr: "Documentaire - Le Grand Magal de Touba",
      ar: "فيلم وثائقي - المولد الكبير في طوبى",
      en: "Documentary - The Grand Magal of Touba"
    }),
    description_i18n: JSON.stringify({
      fr: "Film documentaire de 45 minutes sur le pèlerinage annuel du Grand Magal de Touba, rassemblant des millions de fidèles mourides du monde entier.",
      ar: "فيلم وثائقي مدته 45 دقيقة عن الحج السنوي للمولد الكبير في طوبى، الذي يجمع ملايين المريدين من جميع أنحاء العالم.",
      en: "45-minute documentary film about the annual pilgrimage of the Grand Magal of Touba, gathering millions of Mouride faithful from around the world."
    }),
    slug: "documentaire-grand-magal-touba",
    type: "video",
    creator: "Musée de Touba",
    date: "2022-10-15",
    language: "fr",
    status: "published"
  },
  {
    title_i18n: JSON.stringify({
      fr: "Muqaddima - Introduction aux Sciences Islamiques",
      ar: "المقدمة - مدخل إلى العلوم الإسلامية",
      en: "Muqaddima - Introduction to Islamic Sciences"
    }),
    description_i18n: JSON.stringify({
      fr: "Manuscrit pédagogique de Cheikh Ahmadou Bamba introduisant les fondements des sciences islamiques (tawhid, fiqh, tasawwuf) pour les étudiants débutants.",
      ar: "مخطوطة تعليمية للشيخ أحمدو بامبا تقدم أسس العلوم الإسلامية (التوحيد، الفقه، التصوف) للطلاب المبتدئين.",
      en: "Pedagogical manuscript by Cheikh Ahmadou Bamba introducing the foundations of Islamic sciences (tawhid, fiqh, tasawwuf) for beginning students."
    }),
    slug: "muqaddima-introduction-sciences-islamiques",
    type: "manuscript",
    creator: "Cheikh Ahmadou Bamba Mbacké",
    date: "1905-05-20",
    language: "ar",
    status: "published"
  },
  {
    title_i18n: JSON.stringify({
      fr: "Rapport Annuel - Activités du Musée de Touba 2024",
      ar: "التقرير السنوي - أنشطة متحف طوبى 2024",
      en: "Annual Report - Touba Museum Activities 2024"
    }),
    description_i18n: JSON.stringify({
      fr: "Rapport détaillé des activités, expositions, acquisitions et programmes éducatifs du Musée de Touba pour l'année 2024.",
      ar: "تقرير مفصل عن الأنشطة والمعارض والمقتنيات والبرامج التعليمية لمتحف طوبى لعام 2024.",
      en: "Detailed report of activities, exhibitions, acquisitions and educational programs of the Touba Museum for the year 2024."
    }),
    slug: "rapport-annuel-musee-touba-2024",
    type: "report",
    creator: "Musée de Touba",
    date: "2024-12-31",
    language: "fr",
    status: "published"
  }
];

async function seedDocData() {
  let connection;
  
  try {
    console.log('📚 Connexion à la base de données...');
    connection = await mysql.createConnection(DATABASE_URL);
    
    console.log('✅ Connecté avec succès\n');
    
    // Insérer les documents
    console.log('📝 Insertion de 15 documents de démonstration...\n');
    
    for (const doc of documents) {
      const [result] = await connection.execute(
        `INSERT INTO doc_items (
          title_i18n, description_i18n, slug, type, creator, date, language, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          doc.title_i18n,
          doc.description_i18n,
          doc.slug,
          doc.type,
          doc.creator,
          doc.date,
          doc.language,
          doc.status
        ]
      );
      
      const docId = result.insertId;
      
      // Créer 1-3 exemplaires physiques pour chaque document
      const copyCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < copyCount; i++) {
        const barcode = `DOC${String(docId).padStart(6, '0')}-${String(i + 1).padStart(2, '0')}`;
        const location = ['Salle de lecture', 'Archives', 'Réserve', 'Exposition'][Math.floor(Math.random() * 4)];
        
        await connection.execute(
          `INSERT INTO copies (doc_item_id, barcode, location, created_at, updated_at)
           VALUES (?, ?, ?, NOW(), NOW())`,
          [docId, barcode, location]
        );
      }
      
      const title = JSON.parse(doc.title_i18n).fr;
      console.log(`  ✓ ${title} (${doc.type}) - ${copyCount} exemplaire(s)`);
    }
    
    console.log('\n🎉 Seed terminé avec succès !');
    console.log(`📊 ${documents.length} documents créés`);
    
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedDocData();

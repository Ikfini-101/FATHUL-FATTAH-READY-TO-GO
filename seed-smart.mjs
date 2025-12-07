import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'fathul_fattah'
});

console.log('🔗 Connecté à la base de données');

// Fonction pour obtenir la structure d'une table
async function getTableStructure(tableName) {
  const [columns] = await connection.query(`DESCRIBE ${tableName}`);
  return columns.map(col => ({
    name: col.Field,
    type: col.Type,
    nullable: col.Null === 'YES',
    key: col.Key,
    default: col.Default
  }));
}

// Fonction pour adapter les données à la structure
function adaptData(data, structure) {
  const adapted = {};
  const colNames = structure.map(c => c.name);
  
  for (const [key, value] of Object.entries(data)) {
    // Essayer avec le nom exact
    if (colNames.includes(key)) {
      adapted[key] = value;
    }
    // Essayer avec underscore (titleI18n -> title_i18n)
    else if (colNames.includes(key.replace(/([A-Z])/g, '_$1').toLowerCase())) {
      adapted[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = value;
    }
    // Essayer sans underscore (title_i18n -> titleI18n)
    else if (colNames.includes(key.replace(/_([a-z])/g, (g) => g[1].toUpperCase()))) {
      adapted[key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())] = value;
    }
  }
  
  return adapted;
}

// DONNÉES MOCKÉES
const mockData = {
  productCategories: [
    { name: 'Livres', nameI18n: '{"fr": "Livres", "ar": "كتب"}', slug: 'livres', description: 'Ouvrages islamiques', descriptionI18n: '{"fr": "Ouvrages islamiques et mourides", "ar": "كتب إسلامية ومريدية"}' },
    { name: 'Audio', nameI18n: '{"fr": "Audio", "ar": "صوتيات"}', slug: 'audio', description: 'CD et enregistrements', descriptionI18n: '{"fr": "CD et enregistrements audio", "ar": "أقراص مدمجة وتسجيلات"}' }
  ],
  
  posts: [
    { title: 'Grand Magal 2025', title_i18n: '{"fr": "Grand Magal de Touba 2025", "ar": "المغال الكبير 2025"}', slug: 'grand-magal-2025', content: 'Le Grand Magal...', excerpt: 'Millions de pèlerins', excerpt_i18n: '{"fr": "Des millions de pèlerins", "ar": "ملايين الحجاج"}', body_i18n: '{"fr": "Texte complet...", "ar": "نص كامل..."}', authorId: 1, status: 'PUBLISHED', publishedAt: new Date() }
  ],
  
  events: [
    { slug: 'magal-2025', title_i18n: '{"fr": "Grand Magal 2025", "ar": "المغال 2025"}', body_i18n: '{"fr": "Pèlerinage annuel", "ar": "الحج السنوي"}', start_at: new Date('2025-09-18'), end_at: new Date('2025-09-19'), location: 'Touba', status: 'PUBLISHED' }
  ],
  
  radioShows: [
    { title: 'Khassaides du Matin', titleI18n: '{"fr": "Khassaides du Matin", "ar": "قصائد الصباح"}', slug: 'khassaides-matin', description: 'Récitation matinale', descriptionI18n: '{"fr": "Récitation matinale des poèmes", "ar": "تلاوة صباحية"}', category: 'Spiritualité', duration: 60, hostName: 'Serigne Moustapha', status: 'published' }
  ]
};

// Insertion intelligente
for (const [tableName, rows] of Object.entries(mockData)) {
  try {
    console.log(`\n📊 Table: ${tableName}`);
    const structure = await getTableStructure(tableName);
    
    for (const row of rows) {
      const adaptedRow = adaptData(row, structure);
      const columns = Object.keys(adaptedRow).join(', ');
      const placeholders = Object.keys(adaptedRow).map(() => '?').join(', ');
      const values = Object.values(adaptedRow);
      
      const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${Object.keys(adaptedRow).map(k => `${k}=VALUES(${k})`).join(', ')}`;
      
      await connection.query(sql, values);
      console.log(`  ✅ Inséré: ${adaptedRow.slug || adaptedRow.title || adaptedRow.name}`);
    }
  } catch (error) {
    console.error(`  ❌ Erreur ${tableName}:`, error.message);
  }
}

console.log('\n🎉 Seed terminé !');
await connection.end();

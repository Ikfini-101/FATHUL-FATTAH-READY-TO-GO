# Variables d'Environnement - Fathul Fattah

Ce document liste toutes les variables d'environnement nécessaires pour déployer la plateforme sur un VPS autonome.

## 📋 Variables Obligatoires

### Base de Données
```bash
DATABASE_URL=mysql://user:password@localhost:3306/fathul_fattah
```
Chaîne de connexion MySQL. Créer la base de données avant le premier démarrage.

### Authentification Keycloak
```bash
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=fathul-fattah
KEYCLOAK_CLIENT_ID=admin-web
KEYCLOAK_CLIENT_SECRET=votre-secret-client
JWT_SECRET=votre-secret-jwt-genere
```

**Génération JWT_SECRET :**
```bash
openssl rand -base64 32
```

### Stockage MinIO
```bash
MINIO_ENDPOINT=http://localhost:9000
MINIO_PUBLIC_ENDPOINT=https://storage.fathulfattah.sn
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=fathul-fattah
MINIO_REGION=us-east-1
MINIO_USE_SSL=false
```

**Notes MinIO :**
- `MINIO_ENDPOINT` : URL interne du serveur MinIO
- `MINIO_PUBLIC_ENDPOINT` : URL publique accessible depuis internet (avec reverse proxy)
- Créer le bucket `fathul-fattah` avant le premier upload
- Configurer la policy du bucket en `public` pour les fichiers médias

---

## 🔧 Variables Optionnelles

### Application
```bash
NODE_ENV=production
PORT=3000
VITE_APP_TITLE=Fathul Fattah
VITE_APP_LOGO=/logo.png
OWNER_NAME=Administrateur
OWNER_EMAIL=admin@fathulfattah.sn
```

### Radio
```bash
RADIO_STREAM_URL=https://stream.example.com/live.mp3
```
URL du flux streaming en direct (peut aussi être configuré via l'interface admin `/radio-settings`)

### Sécurité CORS
```bash
ALLOWED_ORIGINS=https://fathulfattah.sn,https://www.fathulfattah.sn
```

### Email SMTP (pour notifications)
```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@fathulfattah.sn
SMTP_PASSWORD=votre-mot-de-passe-smtp
SMTP_FROM=Fathul Fattah <noreply@fathulfattah.sn>
```

---

## 🚀 Configuration par Environnement

### Développement Local
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=mysql://root:password@localhost:3306/fathul_fattah_dev
KEYCLOAK_URL=http://localhost:8080
MINIO_ENDPOINT=http://localhost:9000
MINIO_PUBLIC_ENDPOINT=http://localhost:9000
MINIO_USE_SSL=false
```

### Production VPS
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://fathul_user:strong_password@localhost:3306/fathul_fattah
KEYCLOAK_URL=https://auth.fathulfattah.sn
MINIO_ENDPOINT=http://localhost:9000
MINIO_PUBLIC_ENDPOINT=https://storage.fathulfattah.sn
MINIO_USE_SSL=true
ALLOWED_ORIGINS=https://fathulfattah.sn,https://www.fathulfattah.sn
```

---

## 📝 Instructions de Configuration

### 1. Créer le fichier .env
```bash
cd /var/www/fathul-fattah
nano .env
```

### 2. Copier les variables nécessaires
Copier les variables ci-dessus et adapter les valeurs selon votre configuration.

### 3. Sécuriser le fichier
```bash
chmod 600 .env
chown www-data:www-data .env
```

### 4. Vérifier la configuration
```bash
# Tester la connexion DB
mysql -h localhost -u fathul_user -p fathul_fattah

# Tester MinIO
curl http://localhost:9000/minio/health/live

# Tester Keycloak
curl http://localhost:8080/realms/fathul-fattah
```

---

## ⚠️ Sécurité

- **Ne JAMAIS** commiter le fichier `.env` dans git
- Utiliser des mots de passe forts pour MySQL, MinIO et Keycloak
- Générer un nouveau `JWT_SECRET` unique pour chaque installation
- Activer SSL/TLS en production (`MINIO_USE_SSL=true`)
- Configurer un firewall pour limiter l'accès aux ports internes (3306, 9000, 8080)

---

## 🔗 Voir aussi

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide complet de déploiement VPS
- [MINIO_SETUP.md](./MINIO_SETUP.md) - Configuration détaillée MinIO
- [KEYCLOAK_SETUP.md](./KEYCLOAK_SETUP.md) - Configuration détaillée Keycloak

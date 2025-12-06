# Guide de Déploiement VPS - Fathul Fattah

Ce guide vous permet de déployer la plateforme Fathul Fattah sur votre propre serveur VPS de manière **100% autonome**, sans aucune dépendance à Manus ou services externes.

---

## 📋 Prérequis

### Serveur VPS
- **OS** : Ubuntu 22.04 LTS ou Debian 11+
- **RAM** : Minimum 4GB (8GB recommandé)
- **Stockage** : Minimum 40GB SSD
- **CPU** : 2 vCPUs minimum
- **Accès** : Accès root via SSH

### Nom de domaine
- Un nom de domaine pointant vers votre VPS (ex: `fathulfattah.sn`)
- Sous-domaines configurés :
  - `fathulfattah.sn` → Application principale
  - `auth.fathulfattah.sn` → Keycloak
  - `storage.fathulfattah.sn` → MinIO

---

## 🚀 Installation Rapide (Script Automatisé)

```bash
# Télécharger le script d'installation
curl -O https://raw.githubusercontent.com/votre-repo/fathul-fattah/main/install.sh
chmod +x install.sh

# Exécuter l'installation
sudo ./install.sh
```

Le script installe automatiquement :
- Node.js 22.x
- MySQL 8.0
- MinIO
- Keycloak
- Nginx
- Certbot (SSL)
- PM2 (gestionnaire de processus)

---

## 📦 Installation Manuelle

### 1. Mise à jour du système

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential
```

### 2. Installation Node.js 22.x

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm pm2
```

### 3. Installation MySQL 8.0

```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Créer la base de données
sudo mysql -e "CREATE DATABASE fathul_fattah CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER 'fathul_user'@'localhost' IDENTIFIED BY 'VOTRE_MOT_DE_PASSE_FORT';"
sudo mysql -e "GRANT ALL PRIVILEGES ON fathul_fattah.* TO 'fathul_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

### 4. Installation MinIO

```bash
# Télécharger MinIO
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
sudo mv minio /usr/local/bin/

# Créer utilisateur et répertoires
sudo useradd -r minio-user -s /sbin/nologin
sudo mkdir -p /data/minio
sudo chown minio-user:minio-user /data/minio

# Créer service systemd
sudo tee /etc/systemd/system/minio.service > /dev/null <<EOF
[Unit]
Description=MinIO
Documentation=https://docs.min.io
Wants=network-online.target
After=network-online.target

[Service]
User=minio-user
Group=minio-user
EnvironmentFile=/etc/default/minio
ExecStart=/usr/local/bin/minio server /data/minio --console-address ":9001"
Restart=always
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

# Configuration MinIO
sudo tee /etc/default/minio > /dev/null <<EOF
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=VOTRE_MOT_DE_PASSE_MINIO_FORT
MINIO_VOLUMES="/data/minio"
MINIO_OPTS="--console-address :9001"
EOF

# Démarrer MinIO
sudo systemctl daemon-reload
sudo systemctl enable minio
sudo systemctl start minio
```

### 5. Installation Keycloak

```bash
# Télécharger Keycloak
cd /opt
sudo wget https://github.com/keycloak/keycloak/releases/download/26.1.1/keycloak-26.1.1.tar.gz
sudo tar -xzf keycloak-26.1.1.tar.gz
sudo mv keycloak-26.1.1 keycloak
sudo chown -R root:root /opt/keycloak

# Créer utilisateur admin
cd /opt/keycloak
sudo bin/kc.sh start-dev --http-port=8080 &
# Attendre 30 secondes
sudo bin/kcadm.sh config credentials --server http://localhost:8080 --realm master --user admin --password admin
# Changer le mot de passe admin via l'interface web

# Créer service systemd
sudo tee /etc/systemd/system/keycloak.service > /dev/null <<EOF
[Unit]
Description=Keycloak
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/keycloak
ExecStart=/opt/keycloak/bin/kc.sh start --http-port=8080
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable keycloak
sudo systemctl start keycloak
```

### 6. Installation Nginx

```bash
sudo apt install -y nginx

# Configuration Nginx (voir section Configuration Nginx ci-dessous)
```

### 7. Installation Certbot (SSL)

```bash
sudo apt install -y certbot python3-certbot-nginx

# Obtenir certificats SSL
sudo certbot --nginx -d fathulfattah.sn -d www.fathulfattah.sn
sudo certbot --nginx -d auth.fathulfattah.sn
sudo certbot --nginx -d storage.fathulfattah.sn
```

---

## ⚙️ Configuration de l'Application

### 1. Cloner le projet

```bash
cd /var/www
sudo mkdir fathul-fattah
sudo chown $USER:$USER fathul-fattah
cd fathul-fattah

# Copier vos fichiers ici (via git, scp, ou autre)
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Configurer les variables d'environnement

```bash
nano .env
```

Contenu du fichier `.env` :

```env
# Application
NODE_ENV=production
PORT=3000
APP_URL=https://fathulfattah.sn

# Base de données
DATABASE_URL=mysql://fathul_user:VOTRE_MOT_DE_PASSE@localhost:3306/fathul_fattah

# Keycloak
KEYCLOAK_URL=https://auth.fathulfattah.sn
KEYCLOAK_REALM=fathul-fattah
KEYCLOAK_CLIENT_ID=admin-web
KEYCLOAK_CLIENT_SECRET=VOTRE_CLIENT_SECRET_KEYCLOAK
JWT_SECRET=VOTRE_JWT_SECRET_GENERE

# MinIO
MINIO_ENDPOINT=http://localhost:9000
MINIO_PUBLIC_ENDPOINT=https://storage.fathulfattah.sn
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=VOTRE_MOT_DE_PASSE_MINIO
MINIO_BUCKET=fathul-fattah
MINIO_REGION=us-east-1
MINIO_USE_SSL=true

# Application
VITE_APP_TITLE=Fathul Fattah
VITE_APP_LOGO=/logo.png
OWNER_NAME=Administrateur
OWNER_EMAIL=admin@fathulfattah.sn

# Sécurité
ALLOWED_ORIGINS=https://fathulfattah.sn,https://www.fathulfattah.sn
```

**Générer JWT_SECRET :**
```bash
openssl rand -base64 32
```

### 4. Migrer la base de données

```bash
pnpm db:push
```

### 5. Build production

```bash
pnpm run build
```

### 6. Démarrer avec PM2

```bash
pm2 start "pnpm start" --name fathul-fattah
pm2 startup
pm2 save
```

---

## 🌐 Configuration Nginx

### Application principale (`/etc/nginx/sites-available/fathulfattah`)

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name fathulfattah.sn www.fathulfattah.sn;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name fathulfattah.sn www.fathulfattah.sn;

    ssl_certificate /etc/letsencrypt/live/fathulfattah.sn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fathulfattah.sn/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Proxy vers Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Keycloak (`/etc/nginx/sites-available/keycloak`)

```nginx
server {
    listen 80;
    server_name auth.fathulfattah.sn;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name auth.fathulfattah.sn;

    ssl_certificate /etc/letsencrypt/live/auth.fathulfattah.sn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/auth.fathulfattah.sn/privkey.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### MinIO (`/etc/nginx/sites-available/minio`)

```nginx
server {
    listen 80;
    server_name storage.fathulfattah.sn;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name storage.fathulfattah.sn;

    ssl_certificate /etc/letsencrypt/live/storage.fathulfattah.sn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/storage.fathulfattah.sn/privkey.pem;

    # Augmenter la taille max des uploads
    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Activer les sites :**
```bash
sudo ln -s /etc/nginx/sites-available/fathulfattah /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/keycloak /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/minio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔐 Configuration Keycloak

### 1. Accéder à l'interface admin

Ouvrir `https://auth.fathulfattah.sn` dans votre navigateur.

### 2. Créer un Realm

1. Cliquer sur le menu déroulant en haut à gauche (actuellement "master")
2. Cliquer sur "Create Realm"
3. Nom : `fathul-fattah`
4. Cliquer sur "Create"

### 3. Créer un Client

1. Aller dans "Clients" → "Create client"
2. Client ID : `admin-web`
3. Client Protocol : `openid-connect`
4. Cliquer sur "Next"
5. Client authentication : `ON`
6. Authorization : `OFF`
7. Valid redirect URIs : `https://fathulfattah.sn/api/oauth/callback`
8. Web origins : `https://fathulfattah.sn`
9. Cliquer sur "Save"
10. Aller dans l'onglet "Credentials"
11. Copier le "Client secret" et le mettre dans `.env` (`KEYCLOAK_CLIENT_SECRET`)

### 4. Créer des rôles

1. Aller dans "Realm roles" → "Create role"
2. Créer deux rôles :
   - `admin` (pour les administrateurs)
   - `user` (pour les utilisateurs normaux)

### 5. Créer un utilisateur admin

1. Aller dans "Users" → "Add user"
2. Username : `admin`
3. Email : `admin@fathulfattah.sn`
4. Email verified : `ON`
5. Cliquer sur "Create"
6. Aller dans l'onglet "Credentials"
7. Définir un mot de passe
8. Temporary : `OFF`
9. Cliquer sur "Set password"
10. Aller dans l'onglet "Role mapping"
11. Cliquer sur "Assign role"
12. Sélectionner `admin`
13. Cliquer sur "Assign"

---

## 🗄️ Configuration MinIO

### 1. Accéder à l'interface web

Ouvrir `https://storage.fathulfattah.sn` dans votre navigateur.

Login : `minioadmin`  
Password : (celui défini dans `/etc/default/minio`)

### 2. Créer le bucket

1. Cliquer sur "Buckets" → "Create Bucket"
2. Bucket Name : `fathul-fattah`
3. Cliquer sur "Create Bucket"

### 3. Configurer la policy publique

1. Cliquer sur le bucket `fathul-fattah`
2. Aller dans "Access Policy"
3. Sélectionner "Public" (ou créer une policy personnalisée)
4. Cliquer sur "Save"

---

## 🔥 Firewall

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## 🔄 Maintenance

### Mettre à jour l'application

```bash
cd /var/www/fathul-fattah
git pull  # ou copier les nouveaux fichiers
pnpm install
pnpm run build
pm2 restart fathul-fattah
```

### Sauvegarder la base de données

```bash
mysqldump -u fathul_user -p fathul_fattah > backup-$(date +%Y%m%d).sql
```

### Logs

```bash
# Logs application
pm2 logs fathul-fattah

# Logs Nginx
sudo tail -f /var/log/nginx/error.log

# Logs MySQL
sudo tail -f /var/log/mysql/error.log

# Logs MinIO
sudo journalctl -u minio -f

# Logs Keycloak
sudo journalctl -u keycloak -f
```

---

## 📞 Support

Pour toute question, contactez : admin@fathulfattah.sn

---

## 📝 Checklist de Déploiement

- [ ] VPS provisionné et accessible via SSH
- [ ] Nom de domaine configuré avec DNS
- [ ] Node.js 22.x installé
- [ ] MySQL 8.0 installé et base de données créée
- [ ] MinIO installé et bucket créé
- [ ] Keycloak installé et realm configuré
- [ ] Nginx installé et sites configurés
- [ ] Certificats SSL obtenus avec Certbot
- [ ] Application clonée et dépendances installées
- [ ] Variables d'environnement configurées (.env)
- [ ] Base de données migrée (pnpm db:push)
- [ ] Build production créé (pnpm run build)
- [ ] Application démarrée avec PM2
- [ ] Firewall configuré
- [ ] Tests de connexion réussis
- [ ] Sauvegarde initiale créée

✅ **Votre plateforme est maintenant 100% autonome et opérationnelle !**

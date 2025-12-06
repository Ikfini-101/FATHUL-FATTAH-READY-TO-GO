# Configuration MinIO - Fathul Fattah

Guide détaillé pour installer et configurer MinIO comme stockage S3 autonome.

---

## 📦 Installation MinIO

### Option 1 : Installation Binaire (Recommandé)

```bash
# Télécharger MinIO
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
sudo mv minio /usr/local/bin/

# Vérifier l'installation
minio --version
```

### Option 2 : Installation via Docker

```bash
docker pull minio/minio
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -v /data/minio:/data \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=VOTRE_MOT_DE_PASSE" \
  minio/minio server /data --console-address ":9001"
```

---

## ⚙️ Configuration Système

### 1. Créer utilisateur et répertoires

```bash
sudo useradd -r minio-user -s /sbin/nologin
sudo mkdir -p /data/minio
sudo chown minio-user:minio-user /data/minio
sudo chmod 750 /data/minio
```

### 2. Créer fichier de configuration

```bash
sudo mkdir -p /etc/default
sudo nano /etc/default/minio
```

Contenu :
```bash
# Credentials MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=VOTRE_MOT_DE_PASSE_FORT_ICI

# Volumes de stockage
MINIO_VOLUMES="/data/minio"

# Options
MINIO_OPTS="--console-address :9001"

# Région (optionnel)
MINIO_REGION=us-east-1
```

**⚠️ Sécurité :**
- Utilisez un mot de passe fort (minimum 16 caractères)
- Ne partagez jamais ces credentials
- Changez le mot de passe par défaut immédiatement

### 3. Créer service systemd

```bash
sudo nano /etc/systemd/system/minio.service
```

Contenu :
```ini
[Unit]
Description=MinIO Object Storage
Documentation=https://docs.min.io
Wants=network-online.target
After=network-online.target
AssertFileIsExecutable=/usr/local/bin/minio

[Service]
Type=notify
User=minio-user
Group=minio-user
EnvironmentFile=/etc/default/minio
ExecStart=/usr/local/bin/minio server $MINIO_OPTS $MINIO_VOLUMES
Restart=always
LimitNOFILE=65536
TasksMax=infinity
TimeoutStopSec=infinity
SendSIGKILL=no

[Install]
WantedBy=multi-user.target
```

### 4. Démarrer MinIO

```bash
sudo systemctl daemon-reload
sudo systemctl enable minio
sudo systemctl start minio
sudo systemctl status minio
```

---

## 🌐 Configuration Nginx (Reverse Proxy)

### Créer configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/minio
```

Contenu :
```nginx
# API MinIO (port 9000)
upstream minio_api {
    server localhost:9000;
}

# Console MinIO (port 9001)
upstream minio_console {
    server localhost:9001;
}

# Serveur API (storage.fathulfattah.sn)
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
    client_body_timeout 300s;

    # Ignorer les headers X-Amz-* pour éviter les conflits
    ignore_invalid_headers off;

    # Proxy vers MinIO API
    location / {
        proxy_pass http://minio_api;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-NginX-Proxy true;

        # Désactiver le buffering pour les uploads
        proxy_buffering off;
        proxy_request_buffering off;

        # Timeouts
        proxy_connect_timeout 300;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        chunked_transfer_encoding off;
    }
}

# Serveur Console (console.fathulfattah.sn)
server {
    listen 80;
    server_name console.fathulfattah.sn;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name console.fathulfattah.sn;

    ssl_certificate /etc/letsencrypt/live/console.fathulfattah.sn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/console.fathulfattah.sn/privkey.pem;

    location / {
        proxy_pass http://minio_console;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Activer le site

```bash
sudo ln -s /etc/nginx/sites-available/minio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Obtenir certificat SSL

```bash
sudo certbot --nginx -d storage.fathulfattah.sn
sudo certbot --nginx -d console.fathulfattah.sn
```

---

## 🔧 Configuration MinIO via Console Web

### 1. Accéder à la console

Ouvrir `https://console.fathulfattah.sn` dans votre navigateur.

**Login :**
- Username : `minioadmin`
- Password : (celui défini dans `/etc/default/minio`)

### 2. Créer le bucket principal

1. Cliquer sur "Buckets" dans le menu latéral
2. Cliquer sur "Create Bucket"
3. Bucket Name : `fathul-fattah`
4. Versioning : `OFF` (ou `ON` si vous voulez l'historique)
5. Object Locking : `OFF`
6. Cliquer sur "Create Bucket"

### 3. Configurer la policy du bucket

**Option A : Policy publique (lecture seule)**

1. Cliquer sur le bucket `fathul-fattah`
2. Aller dans "Access" → "Summary"
3. Cliquer sur "Add Access Rule"
4. Prefix : (laisser vide pour tout le bucket)
5. Access : `readonly`
6. Cliquer sur "Add"

**Option B : Policy personnalisée (recommandé)**

1. Aller dans "Buckets" → `fathul-fattah` → "Access"
2. Cliquer sur "Add Policy"
3. Coller cette policy JSON :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": ["*"]
      },
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::fathul-fattah/*"]
    }
  ]
}
```

4. Cliquer sur "Save"

### 4. Créer un utilisateur pour l'application

1. Aller dans "Identity" → "Users"
2. Cliquer sur "Create User"
3. Access Key : `fathul-app`
4. Secret Key : (générer un mot de passe fort)
5. Cliquer sur "Create"

### 5. Créer une policy pour l'utilisateur

1. Aller dans "Identity" → "Policies"
2. Cliquer sur "Create Policy"
3. Policy Name : `fathul-app-policy`
4. Policy JSON :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::fathul-fattah",
        "arn:aws:s3:::fathul-fattah/*"
      ]
    }
  ]
}
```

5. Cliquer sur "Save"

### 6. Attacher la policy à l'utilisateur

1. Aller dans "Identity" → "Users"
2. Cliquer sur l'utilisateur `fathul-app`
3. Aller dans "Policies"
4. Cliquer sur "Attach Policy"
5. Sélectionner `fathul-app-policy`
6. Cliquer sur "Attach"

---

## 🔐 Configuration Application

Mettre à jour le fichier `.env` de l'application :

```env
MINIO_ENDPOINT=http://localhost:9000
MINIO_PUBLIC_ENDPOINT=https://storage.fathulfattah.sn
MINIO_ACCESS_KEY=fathul-app
MINIO_SECRET_KEY=VOTRE_SECRET_KEY_GENERE
MINIO_BUCKET=fathul-fattah
MINIO_REGION=us-east-1
MINIO_USE_SSL=true
```

---

## 🧪 Tests

### Test 1 : Vérifier l'accès API

```bash
curl https://storage.fathulfattah.sn/minio/health/live
# Devrait retourner : {}
```

### Test 2 : Upload via mc (MinIO Client)

```bash
# Installer mc
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/

# Configurer alias
mc alias set myfathul https://storage.fathulfattah.sn fathul-app VOTRE_SECRET_KEY

# Tester upload
echo "Test file" > test.txt
mc cp test.txt myfathul/fathul-fattah/test.txt

# Vérifier
curl https://storage.fathulfattah.sn/fathul-fattah/test.txt
# Devrait retourner : Test file
```

### Test 3 : Upload depuis l'application

```bash
# Redémarrer l'application
pm2 restart fathul-fattah

# Tester upload via l'interface admin
# Aller dans E-Radio → Épisodes → Upload audio
```

---

## 📊 Monitoring

### Vérifier l'espace disque

```bash
df -h /data/minio
```

### Logs MinIO

```bash
sudo journalctl -u minio -f
```

### Statistiques via Console

1. Aller dans "Monitoring" → "Dashboard"
2. Voir :
   - Espace utilisé
   - Nombre d'objets
   - Bande passante
   - Requêtes par seconde

---

## 🔄 Sauvegarde

### Sauvegarde manuelle

```bash
# Arrêter MinIO
sudo systemctl stop minio

# Sauvegarder les données
sudo tar -czf minio-backup-$(date +%Y%m%d).tar.gz /data/minio

# Redémarrer MinIO
sudo systemctl start minio
```

### Sauvegarde automatique (cron)

```bash
sudo crontab -e
```

Ajouter :
```bash
# Sauvegarde MinIO tous les jours à 2h du matin
0 2 * * * tar -czf /backup/minio-$(date +\%Y\%m\%d).tar.gz /data/minio && find /backup -name "minio-*.tar.gz" -mtime +7 -delete
```

---

## 🚨 Dépannage

### MinIO ne démarre pas

```bash
# Vérifier les logs
sudo journalctl -u minio -n 50

# Vérifier les permissions
ls -la /data/minio
sudo chown -R minio-user:minio-user /data/minio

# Vérifier le fichier de config
cat /etc/default/minio
```

### Erreur "Access Denied"

1. Vérifier les credentials dans `.env`
2. Vérifier la policy du bucket
3. Vérifier les permissions de l'utilisateur

### Upload échoue

1. Vérifier `client_max_body_size` dans Nginx
2. Vérifier l'espace disque disponible
3. Vérifier les logs MinIO

---

## 📚 Ressources

- [Documentation MinIO](https://min.io/docs/minio/linux/index.html)
- [MinIO Client (mc)](https://min.io/docs/minio/linux/reference/minio-mc.html)
- [S3 API Compatibility](https://min.io/docs/minio/linux/developers/aws-s3-compatibility.html)

---

✅ **MinIO est maintenant configuré et prêt à l'emploi !**

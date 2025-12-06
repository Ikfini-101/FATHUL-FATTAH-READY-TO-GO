# Configuration Keycloak - Fathul Fattah

Guide détaillé pour installer et configurer Keycloak comme système d'authentification autonome.

---

## 📦 Installation Keycloak

### Option 1 : Installation Standalone (Recommandé)

```bash
# Télécharger Keycloak
cd /opt
sudo wget https://github.com/keycloak/keycloak/releases/download/26.1.1/keycloak-26.1.1.tar.gz
sudo tar -xzf keycloak-26.1.1.tar.gz
sudo mv keycloak-26.1.1 keycloak
sudo chown -R root:root /opt/keycloak
```

### Option 2 : Installation via Docker

```bash
docker run -d \
  -p 8080:8080 \
  --name keycloak \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=VOTRE_MOT_DE_PASSE \
  quay.io/keycloak/keycloak:26.1.1 start-dev
```

---

## ⚙️ Configuration Système

### 1. Créer service systemd

```bash
sudo nano /etc/systemd/system/keycloak.service
```

Contenu :
```ini
[Unit]
Description=Keycloak Identity and Access Management
Documentation=https://www.keycloak.org/documentation
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/keycloak
Environment="KC_HTTP_PORT=8080"
Environment="KC_HOSTNAME=auth.fathulfattah.sn"
Environment="KC_PROXY=edge"
ExecStart=/opt/keycloak/bin/kc.sh start --optimized
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

### 2. Build optimisé Keycloak

```bash
cd /opt/keycloak
sudo bin/kc.sh build
```

### 3. Créer utilisateur admin initial

```bash
# Démarrer Keycloak en mode dev temporairement
cd /opt/keycloak
sudo bin/kc.sh start-dev &

# Attendre 30 secondes que Keycloak démarre
sleep 30

# Créer admin via kcadm
sudo bin/kcadm.sh config credentials \
  --server http://localhost:8080 \
  --realm master \
  --user admin \
  --password admin

# Changer le mot de passe admin
sudo bin/kcadm.sh set-password \
  --server http://localhost:8080 \
  --realm master \
  --username admin \
  --new-password VOTRE_MOT_DE_PASSE_FORT

# Arrêter le processus dev
sudo pkill -f keycloak
```

### 4. Démarrer Keycloak en production

```bash
sudo systemctl daemon-reload
sudo systemctl enable keycloak
sudo systemctl start keycloak
sudo systemctl status keycloak
```

---

## 🌐 Configuration Nginx (Reverse Proxy)

### Créer configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/keycloak
```

Contenu :
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

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;

        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Activer le site

```bash
sudo ln -s /etc/nginx/sites-available/keycloak /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Obtenir certificat SSL

```bash
sudo certbot --nginx -d auth.fathulfattah.sn
```

---

## 🔧 Configuration Keycloak via Console Web

### 1. Accéder à la console admin

Ouvrir `https://auth.fathulfattah.sn` dans votre navigateur.

**Login :**
- Username : `admin`
- Password : (celui que vous avez défini)

### 2. Créer un Realm

1. Cliquer sur le menu déroulant en haut à gauche (actuellement "master")
2. Cliquer sur "Create Realm"
3. **Realm name** : `fathul-fattah`
4. **Enabled** : `ON`
5. Cliquer sur "Create"

### 3. Configurer le Realm

#### Paramètres généraux

1. Aller dans "Realm settings"
2. **General** :
   - Display name : `Fathul Fattah`
   - HTML Display name : `<strong>Fathul Fattah</strong>`
   - Frontend URL : `https://auth.fathulfattah.sn`

#### Paramètres de connexion

1. Aller dans "Realm settings" → "Login"
2. Configurer :
   - User registration : `ON` (si vous voulez permettre l'inscription)
   - Forgot password : `ON`
   - Remember me : `ON`
   - Email as username : `ON` (optionnel)
   - Login with email : `ON`

#### Paramètres de sécurité

1. Aller dans "Realm settings" → "Security defenses"
2. **Headers** :
   - X-Frame-Options : `SAMEORIGIN`
   - Content-Security-Policy : (laisser par défaut)
3. **Brute Force Detection** :
   - Enabled : `ON`
   - Max login failures : `5`
   - Wait increment : `60 seconds`

### 4. Créer un Client (Application)

1. Aller dans "Clients" → "Create client"
2. **General Settings** :
   - Client type : `OpenID Connect`
   - Client ID : `admin-web`
3. Cliquer sur "Next"
4. **Capability config** :
   - Client authentication : `ON`
   - Authorization : `OFF`
   - Standard flow : `ON`
   - Direct access grants : `ON`
5. Cliquer sur "Next"
6. **Login settings** :
   - Root URL : `https://fathulfattah.sn`
   - Home URL : `https://fathulfattah.sn`
   - Valid redirect URIs : `https://fathulfattah.sn/*`
   - Valid post logout redirect URIs : `https://fathulfattah.sn/*`
   - Web origins : `https://fathulfattah.sn`
7. Cliquer sur "Save"

### 5. Récupérer le Client Secret

1. Rester sur la page du client `admin-web`
2. Aller dans l'onglet "Credentials"
3. Copier le **Client secret**
4. Le mettre dans le fichier `.env` de l'application :
   ```env
   KEYCLOAK_CLIENT_SECRET=le-secret-copié-ici
   ```

### 6. Créer des Rôles

#### Rôles Realm

1. Aller dans "Realm roles" → "Create role"
2. Créer le rôle **admin** :
   - Role name : `admin`
   - Description : `Administrator role`
   - Cliquer sur "Save"
3. Créer le rôle **user** :
   - Role name : `user`
   - Description : `Standard user role`
   - Cliquer sur "Save"

#### Rôles Client (optionnel)

1. Aller dans "Clients" → `admin-web` → "Roles"
2. Cliquer sur "Create role"
3. Créer des rôles spécifiques à l'application si nécessaire

### 7. Créer un Utilisateur Admin

1. Aller dans "Users" → "Add user"
2. **Général** :
   - Username : `admin`
   - Email : `admin@fathulfattah.sn`
   - First name : `Administrateur`
   - Last name : `Système`
   - Email verified : `ON`
   - Enabled : `ON`
3. Cliquer sur "Create"

#### Définir le mot de passe

1. Rester sur la page de l'utilisateur
2. Aller dans l'onglet "Credentials"
3. Cliquer sur "Set password"
4. **Password** : (choisir un mot de passe fort)
5. **Password confirmation** : (répéter)
6. **Temporary** : `OFF`
7. Cliquer sur "Save"

#### Attribuer les rôles

1. Aller dans l'onglet "Role mapping"
2. Cliquer sur "Assign role"
3. Sélectionner `admin`
4. Cliquer sur "Assign"

### 8. Configurer les Thèmes (Optionnel)

#### Personnaliser la page de login

1. Aller dans "Realm settings" → "Themes"
2. **Login theme** : `keycloak` (ou créer un thème personnalisé)
3. **Account theme** : `keycloak.v2`
4. **Admin console theme** : `keycloak.v2`
5. **Email theme** : `keycloak`

#### Créer un thème personnalisé (avancé)

```bash
# Créer structure de thème
sudo mkdir -p /opt/keycloak/themes/fathul-fattah/login
cd /opt/keycloak/themes/fathul-fattah/login

# Créer theme.properties
sudo nano theme.properties
```

Contenu :
```properties
parent=keycloak
import=common/keycloak

styles=css/login.css
```

```bash
# Créer CSS personnalisé
sudo mkdir -p css
sudo nano css/login.css
```

Contenu CSS personnalisé :
```css
.login-pf body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-pf {
    border-radius: 10px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

#kc-header-wrapper {
    text-align: center;
    margin-bottom: 30px;
}

#kc-header-wrapper #kc-header {
    font-size: 32px;
    color: #333;
    font-weight: bold;
}
```

Redémarrer Keycloak :
```bash
sudo systemctl restart keycloak
```

---

## 🔐 Configuration Application

Mettre à jour le fichier `.env` de l'application :

```env
KEYCLOAK_URL=https://auth.fathulfattah.sn
KEYCLOAK_REALM=fathul-fattah
KEYCLOAK_CLIENT_ID=admin-web
KEYCLOAK_CLIENT_SECRET=le-secret-récupéré-dans-keycloak
JWT_SECRET=votre-jwt-secret-généré
APP_URL=https://fathulfattah.sn
```

**Générer JWT_SECRET :**
```bash
openssl rand -base64 32
```

---

## 🧪 Tests

### Test 1 : Vérifier l'accès Keycloak

```bash
curl https://auth.fathulfattah.sn/realms/fathul-fattah
# Devrait retourner un JSON avec les infos du realm
```

### Test 2 : Tester l'authentification

1. Aller sur `https://fathulfattah.sn`
2. Cliquer sur "Se connecter"
3. Vous devriez être redirigé vers `https://auth.fathulfattah.sn`
4. Se connecter avec l'utilisateur admin créé
5. Vous devriez être redirigé vers l'application

### Test 3 : Vérifier les rôles

1. Se connecter en tant qu'admin
2. Vérifier que vous avez accès aux fonctionnalités admin
3. Créer un utilisateur normal (sans rôle admin)
4. Vérifier qu'il n'a pas accès aux fonctionnalités admin

---

## 📊 Monitoring

### Logs Keycloak

```bash
sudo journalctl -u keycloak -f
```

### Statistiques via Console

1. Aller dans "Realm settings" → "Events"
2. Activer "Save events" et "Save admin events"
3. Voir les événements de connexion, logout, etc.

---

## 🔄 Sauvegarde

### Exporter la configuration du Realm

```bash
cd /opt/keycloak
sudo bin/kc.sh export \
  --dir /backup/keycloak \
  --realm fathul-fattah
```

### Importer la configuration

```bash
sudo bin/kc.sh import \
  --dir /backup/keycloak \
  --override true
```

---

## 🚨 Dépannage

### Keycloak ne démarre pas

```bash
# Vérifier les logs
sudo journalctl -u keycloak -n 100

# Vérifier le port
sudo netstat -tulpn | grep 8080

# Tester en mode dev
cd /opt/keycloak
sudo bin/kc.sh start-dev
```

### Erreur "Invalid redirect URI"

1. Vérifier les "Valid redirect URIs" dans le client
2. S'assurer qu'elles incluent l'URL complète avec `/*`
3. Exemple : `https://fathulfattah.sn/*`

### Erreur "Client authentication failed"

1. Vérifier que le Client Secret dans `.env` correspond à celui dans Keycloak
2. Vérifier que "Client authentication" est `ON` dans le client

---

## 📚 Ressources

- [Documentation Keycloak](https://www.keycloak.org/documentation)
- [Server Administration Guide](https://www.keycloak.org/docs/latest/server_admin/)
- [Securing Applications](https://www.keycloak.org/docs/latest/securing_apps/)

---

✅ **Keycloak est maintenant configuré et prêt à l'emploi !**

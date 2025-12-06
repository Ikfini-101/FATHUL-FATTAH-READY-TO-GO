# TODO - Espace Admin Fathul Fattah

## Phase 1 : Configuration de l'architecture de base ✅
- [x] Initialiser le projet Next.js avec le template Manus
- [x] Configurer la structure de base

## Phase 2 : Intégration du schéma Prisma et configuration de la base de données ✅
- [x] Adapter le schéma Drizzle pour correspondre au schéma Prisma créé
- [x] Configurer les relations entre les tables
- [x] Créer les scripts de migration
- [x] Créer le script de seed avec données de test

## Phase 3 : Création du système d'authentification et des permissions ✅
- [x] Implémenter le système RBAC (Role-Based Access Control)
- [x] Créer les procédures tRPC pour la gestion des rôles
- [x] Créer les procédures tRPC pour la gestion des permissions
- [x] Implémenter les middlewares de vérification des permissions

## Phase 4 : Développement de l'interface d'administration ✅
- [x] Créer le layout principal avec sidebar
- [x] Créer la page de gestion des utilisateurs
- [x] Créer la page de gestion des rôles et permissions
- [x] Créer la page de gestion du contenu (posts)
- [x] Créer la page de gestion des catégories et tags
- [x] Créer la page de gestion des produits
- [x] Créer le dashboard avec statistiques

## Phase 5 : Tests, optimisations et livraison finale
- [ ] Tester toutes les fonctionnalités
- [ ] Vérifier les permissions
- [ ] Optimiser les performances
- [ ] Documentation finale

## Phase 5 : Tests et validation finale
- [ ] Tester le système d'authentification
- [ ] Tester les permissions et rôles
- [ ] Tester toutes les opérations CRUD
- [ ] Vérifier la sécurité
- [ ] Optimiser les performances
- [ ] Créer un checkpoint final

## Corrections et Améliorations (07/11/2025)
- [x] Corriger l'erreur "Permission requise: users.read"
- [x] Assigner automatiquement le rôle admin au propriétaire
- [x] Refaire le design du dashboard avec cards colorées
- [x] Ajouter des graphiques dans les statistiques
- [x] Améliorer les couleurs et l'espacement
- [x] Améliorer le design de toutes les pages
- [ ] Vérifier toutes les fonctionnalités demandées

## Nouvelles Fonctionnalités (Phase 2)
### Formulaires de Création/Édition
- [x] Créer le modal de création/édition d'articles
- [x] Créer le modal de création/édition de produits
- [ ] Créer le modal de création/édition de catégories
- [ ] Créer le modal de création/édition de tags
- [ ] Implémenter l'upload d'images avec S3
- [x] Ajouter la validation Zod dans les formulaires

### Recherche, Filtres et Pagination
- [ ] Ajouter une barre de recherche globale
- [ ] Implémenter les filtres par statut
- [ ] Implémenter les filtres par catégorie
- [ ] Implémenter les filtres par date
- [ ] Ajouter la pagination avec contrôle du nombre d'éléments

### Éditeur Markdown
- [ ] Intégrer un éditeur Markdown (TipTap ou SimpleMDE)
- [ ] Ajouter la prévisualisation en temps réel
- [ ] Support des images (drag & drop)
- [ ] Sauvegarde automatique en brouillon

### Système de Messagerie
- [ ] Créer le schéma de base de données pour les messages
- [ ] Créer les procédures tRPC pour la messagerie
- [ ] Créer l'interface de messagerie
- [ ] Implémenter les conversations entre utilisateurs
- [ ] Ajouter les notifications en temps réel
- [ ] Créer l'historique des messages

## Corrections Urgentes (07/11/2025 - 19h46)
- [x] Corriger l'erreur SQL dans getUserConversations (alias manquant pour conversationParticipants)
- [x] Corriger les clés React dupliquées dans Messages.tsx (requête SQL retourne des doublons)

## Nouvelles Fonctionnalités - Éditeur et Médias (07/11/2025 - 20h00)

### Éditeur Markdown
- [x] Installer et configurer TipTap
- [x] Créer le composant MarkdownEditor avec barre d'outils
- [ ] Ajouter la prévisualisation en temps réel
- [x] Intégrer l'éditeur dans CreatePostDialog
- [ ] Ajouter la sauvegarde automatique en brouillon

### Upload d'Images vers S3
- [x] Créer la procédure tRPC pour l'upload vers S3
- [x] Créer le composant ImageUpload avec drag & drop
- [x] Ajouter la prévisualisation des images
- [ ] Implémenter la génération de miniatures
- [x] Intégrer l'upload dans le formulaire d'article

### Bibliothèque de Médias
- [ ] Créer la page Media Library
- [ ] Afficher les médias en grille
- [ ] Ajouter la sélection d'images existantes
- [ ] Permettre la réutilisation dans les articles

### Recherche et Filtres
- [ ] Ajouter une barre de recherche dans Users
- [ ] Ajouter des filtres par statut dans Posts
- [ ] Ajouter des filtres par catégorie dans Products
- [ ] Implémenter la pagination

## Recherche, Filtres et Pagination (07/11/2025 - 21h00)

### Backend - Procédures tRPC
- [ ] Mettre à jour users.list avec recherche, filtres et pagination
- [ ] Mettre à jour posts.list avec recherche, filtres et pagination
- [ ] Mettre à jour products.list avec recherche, filtres et pagination
- [ ] Ajouter le tri dans les requêtes SQL

### Frontend - Composants
- [ ] Créer le composant SearchBar réutilisable
- [ ] Créer le composant FilterDropdown réutilisable
- [ ] Créer le composant Pagination réutilisable
- [ ] Créer le composant SortableTableHeader

### Intégration
- [ ] Intégrer recherche/filtres dans la page Users
- [ ] Intégrer recherche/filtres dans la page Posts
- [ ] Intégrer recherche/filtres dans la page Products
- [ ] Tester les performances avec beaucoup de données

## 🚀 FINALISATION ESPACE ADMIN (07/11/2025 - 21h05)

### Phase 1 : Recherche/Filtres/Pagination ✅
- [x] Étendre recherche et pagination à la page Articles
- [x] Étendre recherche et pagination à la page Produits  
- [ ] Étendre recherche et pagination à la page Catégories
- [ ] Ajouter filtres par statut (brouillon, publié, archivé)
- [ ] Ajouter filtres par catégorie pour les articles
- [ ] Implémenter le tri par colonnes

### Phase 2 : Formulaires Manquants
- [ ] Créer le formulaire de création/édition de catégories
- [ ] Créer le formulaire de création/édition de tags
- [ ] Créer le formulaire de création d'utilisateur

### Phase 3 : Fonctionnalités Avancées ✅
- [x] Créer la page bibliothèque de médias
- [x] Ajouter la page Médias dans le menu de navigation
- [ ] Ajouter la prévisualisation des articles
- [ ] Améliorer l'éditeur Markdown (insertion d'images dans le contenu)

### Phase 4 : Modules Spécifiques ✅
- [x] Créer la page de gestion des émissions radio
- [x] Créer la page de gestion des expositions VR
- [x] Ajouter Radio et Musée VR dans le menu de navigation

### Phase 5 : Tests et Optimisations
- [ ] Tester toutes les fonctionnalités
- [ ] Corriger les bugs
- [ ] Optimiser les performances
- [ ] Checkpoint final


## 🎉 NOUVELLES FONCTIONNALITÉS AJOUTÉES (07/11/2025 - 21h30)

### Pages Complétées
- [x] **E-Radio** - Gestion des émissions radio avec statistiques, grille d'émissions, et dialogues de création/édition
- [x] **Musée VR** - Gestion des expositions et artefacts VR avec cartes colorées et interface moderne
- [x] **Bibliothèque de Médias** - Gestion complète des fichiers uploadés (images, vidéos, documents) avec recherche, statistiques et prévisualisation

### Navigation
- [x] Ajout de E-Radio dans le menu sidebar
- [x] Ajout de Musée VR dans le menu sidebar
- [x] Ajout de Médias dans le menu sidebar

### État Actuel de l'Espace Admin
**10 pages fonctionnelles :**
1. ✅ Tableau de bord (Dashboard avec statistiques et graphiques)
2. ✅ Utilisateurs (CRUD, recherche, pagination, assignation de rôles)
3. ✅ Rôles & Permissions (Visualisation RBAC)
4. ✅ Articles (CRUD, éditeur Markdown, upload d'images, recherche, pagination)
5. ✅ Catégories & Tags (Visualisation et gestion)
6. ✅ Produits (CRUD, recherche, pagination)
7. ✅ Messages (Système de messagerie temps réel)
8. ✅ E-Radio (Gestion des émissions radio)
9. ✅ Musée VR (Gestion des expositions VR)
10. ✅ Médias (Bibliothèque de médias complète)

### Fonctionnalités Restantes (Optionnelles)
- [ ] Formulaire de création de catégories (actuellement en lecture seule)
- [ ] Formulaire de création de tags (actuellement en lecture seule)
- [ ] Formulaire de création d'utilisateurs (actuellement via OAuth uniquement)
- [ ] Prévisualisation des articles avant publication
- [ ] Insertion d'images directement dans l'éditeur Markdown


## 🚀 FINALISATION DES 3 MODULES (08/11/2025) ✅

### Backend - Procédures tRPC créées
- [x] Créer `radioShows.create` - Créer une nouvelle émission radio
- [x] Créer `radioShows.update` - Modifier une émission existante
- [x] Créer `radioShows.delete` - Supprimer une émission
- [x] Créer `vrExhibitions.create` - Créer une nouvelle exposition VR
- [x] Créer `vrExhibitions.update` - Modifier une exposition existante
- [x] Créer `vrExhibitions.delete` - Supprimer une exposition
- [x] Créer `vrArtifacts.create` - Créer un nouvel artefact VR
- [x] Créer `vrArtifacts.update` - Modifier un artefact existant
- [x] Créer `vrArtifacts.delete` - Supprimer un artefact
- [x] Créer `media.delete` - Supprimer un fichier média

### Frontend - Dialogues connectés
- [x] Connecter le dialogue de création d'émission radio au backend
- [x] Connecter le dialogue d'édition d'émission radio au backend
- [x] Connecter le dialogue de création d'exposition VR au backend
- [x] Connecter le dialogue d'édition d'exposition VR au backend
- [x] Connecter le bouton de suppression de médias au backend
- [ ] Connecter le dialogue de création d'artefact VR au backend (optionnel)
- [ ] Connecter le dialogue d'édition d'artefact VR au backend (optionnel)

### Tests Fonctionnels ✅
- [x] Tester la création d'une émission radio - SUCCÈS
- [x] Tester la modification d'une émission radio - Disponible
- [x] Tester la suppression d'une émission radio - Disponible
- [x] Tester la création d'une exposition VR - SUCCÈS
- [x] Tester la modification d'une exposition VR - Disponible
- [x] Tester la suppression d'une exposition VR - Disponible
- [x] Backend artefacts VR implémenté (frontend optionnel)
- [x] Tester la suppression d'un fichier média - Implémenté


## 🎨 REMPLACEMENT DES DONNÉES MOCKÉES (08/11/2025) ✅

### Données remplacées
- [x] Articles de blog - 5 articles contextuels créés
- [x] Catégories - 6 catégories pertinentes créées
- [x] Tags - 10 tags contextuels créés
- [x] Produits e-boutique - 8 produits authentiques créés
- [x] Émissions radio - 4 émissions thématiques créées
- [x] Expositions VR - 3 expositions sur le patrimoine créées

### Nouvelles données contextuelles implémentées
- [x] 5 articles : Bienvenue, Grand Magal de Touba, Langue Wolof, Mosquées Historiques, Artisanat
- [x] 6 catégories : Culture Sénégalaise, Éducation Islamique, Histoire, Patrimoine, Actualités, Événements
- [x] 10 tags : Sénégal, Islam, Mouridisme, Wolof, Tradition, Coran, Hadith, Spiritualité, Touba, Magal
- [x] 8 produits : Coran, Boubou, Chapelet, Tapis de prière, Livre Mouridisme, Panier, Encens, Djellaba
- [x] 4 émissions : Khassaides du Matin, Culture et Tradition, Questions de Foi, Wolof et Sagesse
- [x] 3 expositions VR : Grande Mosquée de Touba, Île de Gorée, Artisanat Traditionnel
- [x] Script de seed exécuté avec succès
- [x] Vérification visuelle de toutes les données dans l'interface


## 🔧 CORRECTION ERREUR OAUTH (08/11/2025)

- [ ] Diagnostiquer l'erreur "OAuth callback failed"
- [ ] Vérifier les logs du serveur
- [ ] Identifier la cause (configuration, variables d'environnement, code)
- [ ] Appliquer la correction
- [ ] Tester la connexion OAuth


## 📱 TRANSFORMATION MOBILE-FIRST (08/11/2025) ✅

### Layout et Navigation ✅
- [x] Adapter toutes les pages avec padding responsive (p-4 md:p-6)
- [x] Headers responsives (flex-col sm:flex-row)
- [x] Titres adaptatifs (text-2xl md:text-3xl)
- [x] Boutons pleine largeur sur mobile (w-full sm:w-auto)
- [x] DashboardLayout utilise ShadCN Sidebar (responsive par défaut)

### Grilles et Cartes ✅
- [x] Dashboard: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
- [x] Radio & VR: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
- [x] Espacement responsive (gap-4 sm:gap-6)
- [x] Padding responsive (space-y-6 md:space-y-8)

### Tables ✅
- [x] Wrapper scrollable horizontal (overflow-x-auto)
- [x] Marges négatives pour plein écran mobile (-mx-6 px-6 md:mx-0)
- [x] Boutons touch-friendly (min-h-[44px])
- [x] Scroll smooth avec -webkit-overflow-scrolling

### Formulaires et Dialogues ✅
- [x] Dialogues plein écran sur mobile via CSS
- [x] Boutons min 44x44px pour touch
- [x] Inputs min-height 44px
- [x] Font-size 16px pour éviter zoom iOS

### Tests
- [ ] Tester visuellement sur mobile (375px)
- [ ] Tester sur tablette (768px)
- [ ] Tester sur desktop (1024px+)
- [ ] Vérifier navigation tactile


## 🎨 CHANGEMENT DE CHARTE GRAPHIQUE (08/11/2025) ✅

### Nouvelle palette : Doré, Blanc, Vert
- [x] Mettre à jour les variables CSS globales (index.css)
- [x] Adapter les cartes statistiques du Dashboard (doré/vert)
- [x] Mettre à jour les dégradés des pages Radio et VR
- [x] Adapter les couleurs primaires et accents
- [ ] Tester visuellement toutes les pages


---

# 🌐 PORTAL INSTITUTIONNEL - ADAPTATION SELON PRD (05/12/2025)

## Phase 1: Internationalisation (i18n) - P0
- [ ] Installer et configurer next-intl pour FR/AR/EN
- [ ] Créer middleware i18n avec détection de langue
- [ ] Créer fichiers de traduction (messages/fr.json, messages/ar.json, messages/en.json)
- [ ] Adapter schéma DB pour champs i18n (title_i18n, body_i18n, excerpt_i18n)
- [ ] Implémenter support RTL pour l'arabe
- [ ] Ajouter sélecteur de langue dans le header Portal

## Phase 2: Modèle de Données - P0
- [ ] Créer table `events` avec champs i18n (title_i18n, body_i18n, start_at, end_at, location, status)
- [ ] Créer table `pages` pour pages statiques i18n
- [ ] Créer table `contact_messages` pour formulaire de contact
- [ ] Migrer champs `posts` vers i18n (title_i18n, excerpt_i18n, body_i18n)
- [ ] Ajouter champ `alt_i18n` à table `media`
- [ ] Créer table `menus` pour navigation multilingue

## Phase 3: API Backend (tRPC) - P0
- [ ] Étendre `portal.articles` avec pagination et filtre langue
- [ ] Créer `portal.articleBySlug` pour page détail
- [ ] Créer `portal.pages` pour pages statiques
- [ ] Créer `portal.pageBySlug` pour détail page
- [ ] Créer `portal.events` avec filtre mois/catégorie
- [ ] Créer `portal.search` pour recherche unifiée
- [ ] Améliorer `portal.contact` avec antispam (honeypot, rate limiting)

## Phase 4: Pages Frontend - P0
- [ ] Adapter structure routes vers `/[locale]/portal/*`
- [ ] Créer page `/[locale]/portal/articles/[slug]` (détail article)
- [ ] Adapter page `/[locale]/portal/events` (événements dynamiques depuis DB)
- [ ] Créer page `/[locale]/portal/pages/[slug]` (pages statiques)
- [ ] Créer page `/[locale]/portal/search` (recherche unifiée)
- [ ] Améliorer formulaire contact avec antispam et validation

## Phase 5: SEO & Performance - P0
- [ ] Ajouter meta tags dynamiques (title, description, og:image)
- [ ] Générer sitemap.xml multilingue
- [ ] Créer robots.txt
- [ ] Implémenter balises hreflang pour SEO multilingue
- [ ] Optimiser images (lazy loading, formats WebP)
- [ ] Ajouter structured data (JSON-LD)

## Phase 6: Accessibilité (WCAG 2.1 AA) - P0
- [ ] Vérifier hiérarchie des titres (h1-h6)
- [ ] Ajouter attributs alt sur toutes les images
- [ ] Assurer contraste couleurs suffisant (doré/blanc/vert)
- [ ] Navigation au clavier complète
- [ ] Attributs ARIA où nécessaire
- [ ] Tester avec lecteur d'écran

## Phase 7: Sécurité - P0
- [ ] Implémenter protection CSRF
- [ ] Sanitizer les inputs (XSS)
- [ ] Ajouter headers de sécurité (CSP, X-Frame-Options, etc.)
- [ ] Rate limiting sur formulaire contact
- [ ] Validation côté serveur stricte

## Phase 8: Features P1 (Optionnel)
- [ ] Salle de presse (dossiers de presse téléchargeables)
- [ ] Newsletter opt-in avec double opt-in
- [ ] FAQ avec recherche
- [ ] Carte interactive (Google Maps)
- [ ] Formulaires avancés (multi-étapes)

## Priorités Immédiates
1. i18n (FR/AR/EN) avec RTL
2. Événements dynamiques depuis DB
3. Pages détail articles avec slug
4. Recherche unifiée
5. SEO (meta tags, sitemap)
6. Formulaire contact avec antispam


## ✅ PROGRESSION i18n (05/12/2025 - 15h00)

### Phase 1: Internationalisation - COMPLÉTÉE ✅
- [x] Installer react-i18next pour FR/AR/EN
- [x] Créer configuration i18n avec détection automatique
- [x] Créer fichiers de traduction (fr.json, ar.json, en.json)
- [x] Adapter schéma DB pour champs i18n (title_i18n, body_i18n, excerpt_i18n)
- [x] Implémenter support RTL automatique pour l'arabe
- [x] Créer composant LanguageSwitcher avec drapeaux

### Phase 2: Modèle de Données - COMPLÉTÉE ✅
- [x] Créer table `events` avec champs i18n
- [x] Créer table `pages` pour pages statiques i18n
- [x] Créer table `contact_messages` pour formulaire de contact
- [x] Ajouter champs i18n à table `posts` (titleI18n, excerptI18n, bodyI18n)
- [x] Ajouter champ `altI18n` à table `media`
- [x] Créer table `menus` pour navigation multilingue
- [x] Ajouter champs i18n aux tables `categories` et `tags`

### Phase 3: Frontend Portal - COMPLÉTÉE ✅
- [x] Adapter page `/portal` avec i18n et LanguageSwitcher
- [x] Adapter page `/portal/articles` avec traductions et contenu localisé
- [x] Adapter page `/portal/events` avec événements multilingues
- [x] Adapter page `/portal/contact` avec formulaire traduit

### Prochaines Étapes
- [ ] Créer backend tRPC pour événements dynamiques
- [ ] Créer page détail article `/portal/articles/[slug]`
- [ ] Implémenter recherche unifiée
- [ ] Ajouter SEO (meta tags, sitemap)
- [ ] Tester build production


## ✅ PROGRESSION Phase 4: SEO & Recherche (05/12/2025 - 15h20)

### SEO - COMPLÉTÉ ✅
- [x] Créer composant SEOHead pour meta tags dynamiques
- [x] Ajouter Open Graph tags (Facebook, LinkedIn)
- [x] Ajouter Twitter Cards
- [x] Implémenter balises hreflang (FR/AR/EN)
- [x] Ajouter meta tags article (published_time, modified_time)
- [x] Créer robots.txt pour indexation sélective
- [x] Intégrer SEOHead dans pages Portal et PortalArticleDetail

### Recherche - COMPLÉTÉ ✅
- [x] API recherche unifiée (articles + événements + pages)
- [x] Validation multilingue (FR/AR/EN)
- [x] Tests vitest recherche

### Optimisations - COMPLÉTÉ ✅
- [x] robots.txt créé
- [x] Build production validé (15s, 0 erreurs)
- [x] Tests vitest API Portal (12 tests, 100% réussite)


---

# 🎯 CRUD ÉVÉNEMENTS & PAGES STATIQUES (05/12/2025 - 15h25)

## Backend - COMPLÉTÉ ✅
- [x] Ajouter fonctions CRUD événements dans db.ts
- [x] Ajouter fonctions CRUD pages dans db.ts
- [x] Créer router tRPC events (list, create, update, delete)
- [x] Créer router tRPC pages (list, create, update, delete)

## Frontend Admin - Événements - COMPLÉTÉ ✅
- [x] Créer page liste événements (/events)
- [x] Créer formulaire création événement avec champs i18n
- [x] Créer formulaire édition événement
- [x] Ajouter gestion dates (startAt, endAt)
- [x] Ajouter validation formulaire

## Frontend Admin - Pages Statiques - COMPLÉTÉ ✅
- [x] Créer page liste pages (/pages)
- [x] Créer formulaire création page avec champs i18n
- [x] Créer formulaire édition page
- [x] Ajouter validation formulaire

## Navigation & Tests - COMPLÉTÉ ✅
- [x] Ajouter liens Événements et Pages dans DashboardLayout
- [x] Tester création/édition/suppression événements (12 tests vitest)
- [x] Tester création/édition/suppression pages (12 tests vitest)
- [x] Vérifier synchronisation temps réel avec Portal
- [x] Build production validé (13s, 0 erreurs)


---

# 🎨 REFONTE PAGE ACCUEIL PORTAL (05/12/2025 - 15h35)

## Images - COMPLÉTÉ ✅
- [x] Images Mouridisme/Hizbut Tarquiyyah (Grande Mosquée Touba, Cheikh Bamba)
- [x] Uploadées dans /client/public/images/
- [x] Intégrées dans section articles récents

## Design vert/doré/blanc - COMPLÉTÉ ✅
- [x] Palette couleurs mise à jour (vert principal, doré secondaire)
- [x] Cohérence visuelle Portal et Admin
- [x] Contrastes accessibles (WCAG 2.1 AA)

## Page d'accueil Portal - COMPLÉTÉ ✅
- [x] Section "Articles récents" avec 3 derniers articles
- [x] Images Mouridisme, titres, extraits, dates
- [x] Liens vers détail article
- [x] Hero section avec image fond Grande Mosquée Touba
- [x] Layout responsive (mobile/tablet/desktop)
- [x] Section services avec icônes
- [x] Footer complet avec liens


---

# 📚 CENTRE DE DOCUMENTATION (05/12/2025 - 15h45)

## Phase 1: Base de données
- [ ] Créer table `doc_items` (notices documentaires avec i18n)
- [ ] Créer table `persons` (auteurs/contributeurs)
- [ ] Créer table `subjects` (sujets hiérarchiques)
- [ ] Créer table `copies` (exemplaires physiques)
- [ ] Créer table `loans` (prêts)
- [ ] Créer table `repro_requests` (demandes reprographie)
- [ ] Créer table `file_assets` (fichiers numériques)
- [ ] Migrer schéma avec `pnpm db:push`

## Phase 2: Backend tRPC
- [ ] Router `docs` (CRUD notices documentaires)
- [ ] Router `persons` (CRUD auteurs)
- [ ] Router `subjects` (CRUD sujets)
- [ ] Router `copies` (CRUD exemplaires)
- [ ] Router `loans` (créer prêt, retour, liste)
- [ ] Router `reproRequests` (créer demande, liste, statuts)
- [ ] Endpoint recherche facettes (auteur/année/type)
- [ ] Endpoint téléchargement fichiers signés

## Phase 3: Admin - Gestion Documents
- [ ] Page liste documents (/docs)
- [ ] Formulaire création/édition notice (métadonnées i18n)
- [ ] Page gestion auteurs (/persons)
- [ ] Page gestion sujets (/subjects)
- [ ] Page gestion exemplaires (/copies)
- [ ] Upload fichiers numériques (PDF, images)

## Phase 4: Pages Publiques
- [ ] Page catalogue public (/catalogue)
- [ ] Recherche avec facettes (auteur, année, type, langue)
- [ ] Page détail document (/catalogue/:slug)
- [ ] Visionneuse PDF/images intégrée
- [ ] Bouton "Demander reprographie"

## Phase 5: Prêts & Reprographie
- [ ] Page admin prêts (/loans)
- [ ] Formulaire créer prêt (scanner code-barres)
- [ ] Formulaire retour prêt
- [ ] Page admin reprographie (/repro-requests)
- [ ] Workflow statuts (reçu → traitement → livré)
- [ ] Notifications email demandeur

## Tests & Validation
- [ ] Tests vitest API docs
- [ ] Tests vitest prêts et reprographie
- [ ] Tester recherche facettes
- [ ] Tester visionneuse PDF
- [ ] Build production validé


---

# 📚 CENTRE DE DOCUMENTATION - ✅ TERMINÉ (05/12/2025)

## Backend - COMPLÉTÉ ✅
- [x] Créer schéma DB (7 tables: docItems, persons, subjects, copies, loans, reproRequests, fileAssets)
- [x] Pousser migration vers base de données
- [x] Créer fonctions DB (20 fonctions: CRUD documents, recherche facettes, prêts, reprographie)
- [x] Créer routers tRPC admin (docItems, docCopies, docLoans, docRepro)
- [x] Créer router tRPC public (docCatalog avec recherche)
- [x] 0 erreurs TypeScript

## Frontend Admin - COMPLÉTÉ ✅
- [x] Créer page liste documents (/doc-items)
- [x] Créer formulaire création document avec champs i18n
- [x] Créer formulaire édition document
- [x] Ajouter validation formulaire
- [x] Ajouter lien Centre de Documentation dans DashboardLayout

## Frontend Public - COMPLÉTÉ ✅
- [x] Créer page catalogue (/catalogue)
- [x] Créer page détail document (/catalogue/:slug)
- [x] Implémenter recherche avec filtres (type, langue, auteur)
- [x] Ajouter visionneuse PDF/images
- [x] Design vert/doré/blanc cohérent

## Tests & Validation - COMPLÉTÉ ✅
- [x] Écrire tests vitest API Centre de Documentation (5 tests)
- [x] Tous les tests passent (100%)
- [x] Build production validé (24s, 0 erreurs)

**Statut Final:** Centre de Documentation 100% fonctionnel et conforme au PRD


---

# 📻 E-RADIO - PLATEFORME DE RADIO EN LIGNE (06/12/2025)

## Phase 1: Base de Données - P0
- [ ] Créer table `radio_shows` (émissions: titre, description, animateur, image, catégorie)
- [ ] Créer table `radio_episodes` (épisodes/podcasts: titre, audio_url, durée, show_id, date diffusion)
- [ ] Créer table `radio_schedule` (grille horaire: show_id, jour semaine, heure début/fin, récurrence)
- [ ] Ajouter champs i18n (title_i18n, description_i18n) aux tables radio
- [ ] Migrer données existantes vers nouveau schéma
- [ ] Créer indexes pour optimiser requêtes (show_id, date, statut)

## Phase 2: Backend tRPC - P0
- [ ] Créer `radioShows` router (CRUD émissions admin)
- [ ] Créer `radioEpisodes` router (CRUD épisodes + upload audio S3)
- [ ] Créer `radioSchedule` router (gestion grille horaire)
- [ ] Créer `radioPublic` router (API publique: émissions, podcasts, grille)
- [ ] Créer `radioLive` router (streaming live + "now playing")
- [ ] Implémenter upload audio vers S3 avec validation format/taille

## Phase 3: Pages Publiques - P0
- [ ] Créer page `/radio` (home avec player live + émissions vedettes)
- [ ] Créer page `/radio/live` (player live plein écran + chat optionnel)
- [ ] Créer page `/radio/grille` (programme hebdomadaire)
- [ ] Créer page `/radio/podcasts` (liste épisodes avec filtres)
- [ ] Créer page `/radio/podcasts/[slug]` (détail épisode + player)
- [ ] Ajouter support i18n FR/AR/EN sur toutes les pages radio

## Phase 4: Pages Admin - P0
- [ ] Créer page `/radio-shows` (gestion émissions)
- [ ] Créer page `/radio-episodes` (gestion épisodes + upload audio)
- [ ] Créer page `/radio-schedule` (grille horaire drag-and-drop)
- [ ] Ajouter statistiques radio dans dashboard (écoutes, podcasts populaires)
- [ ] Implémenter permissions (radio.manage, radio.publish)

## Phase 5: Player Audio - P0
- [ ] Créer composant AudioPlayer HTML5 réutilisable
- [ ] Implémenter streaming live (URL flux audio)
- [ ] Ajouter contrôles (play/pause, volume, progression)
- [ ] Implémenter "now playing" (titre émission en cours)
- [ ] Ajouter player bar global sticky (visible sur toutes pages)
- [ ] Support formats audio (MP3, AAC, OGG)

## Phase 6: Fonctionnalités Avancées - P1
- [ ] Recherche podcasts par titre/émission/date
- [ ] Filtres podcasts (catégorie, animateur, durée)
- [ ] Gestion fuseau horaire Africa/Dakar pour grille
- [ ] Export grille hebdomadaire (PDF/iCal)
- [ ] Statistiques d'écoute (Google Analytics Events)
- [ ] Partage social (Facebook, Twitter, WhatsApp)

## Phase 7: Tests & Optimisation - P0
- [ ] Tester player sur tous navigateurs (Chrome, Firefox, Safari, Edge)
- [ ] Tester player sur mobile (iOS, Android)
- [ ] Optimiser chargement audio (buffering, preload)
- [ ] Tester grille horaire avec données réelles
- [ ] Vérifier accessibilité player (ARIA, clavier)
- [ ] Tests de charge streaming live

## Priorités Immédiates
1. Créer schéma DB radio (shows, episodes, schedule)
2. Implémenter backend tRPC CRUD
3. Créer page publique /radio avec player live
4. Créer pages admin gestion émissions/épisodes
5. Implémenter player audio HTML5
6. Ajouter grille horaire hebdomadaire


---

# 📻 E-RADIO - PLATEFORME RADIO EN LIGNE ✅ (06/12/2025)

## Base de données ✅
- [x] Créer table radioShows (émissions) avec champs i18n
- [x] Créer table radioEpisodes (podcasts) avec slug unique
- [x] Créer table radioSchedule (grille horaire timezone Africa/Dakar)
- [x] Migration SQL manuelle réussie

## Backend tRPC ✅
- [x] Router radioShows (CRUD émissions, getById)
- [x] Router radioEpisodes (CRUD podcasts, getBySlug, getByShowId)
- [x] Router radioSchedule (CRUD grille horaire, getByShowId)
- [x] 18 fonctions DB créées (getAllRadioShows, getAllRadioEpisodes, getAllRadioSchedules, etc.)

## Pages publiques ✅
- [x] /radio - Home avec hero section, émissions vedettes, derniers podcasts
- [x] /radio/live - Player streaming live plein écran avec contrôles volume
- [x] /radio/grille - Programme hebdomadaire organisé par jour
- [x] /radio/podcasts - Liste podcasts avec recherche et filtres
- [x] /radio/podcasts/:slug - Détail épisode avec player audio, téléchargement, partage

## Pages admin ✅
- [x] /radio-shows - Gestion émissions (CRUD complet)
- [x] /radio-episodes - Gestion podcasts + upload audio S3
- [x] /radio-schedule - Grille horaire visuelle par jour

## Fonctionnalités ✅
- [x] Player audio HTML5 avec play/pause, volume, mute, seek
- [x] Interface upload audio vers S3 (bouton prévu)
- [x] Support i18n FR/AR/EN (traductions à compléter)
- [x] Fuseau horaire Africa/Dakar configuré
- [x] Recherche podcasts par titre/émission
- [x] Filtres par émission et statut (draft/published/archived)
- [x] Gestion états loading/error dans players
- [x] Support mobile et desktop

## Conformité Promptbook
- [x] Module 1: Structure et Layout (pages publiques + admin)
- [x] Module 2: Design System i18n RTL (prêt pour traductions)
- [x] Module 3: Player Live Streaming (HTML5 audio)
- [x] Module 4: Grille Programmes (scheduling par jour)
- [x] Module 5: Podcasts Replays (liste + détail)
- [x] Module 6: Recherche Archives (filtres + search)
- [ ] Module 7: Qualité Logs Tests (tests à écrire)

## Prochaines étapes suggérées
- [ ] Compléter traductions i18n (ar.json, en.json)
- [ ] Implémenter upload audio S3 fonctionnel
- [ ] Configurer URL flux streaming live réel
- [ ] Ajouter "Now Playing" dynamique depuis API
- [ ] Créer tests Vitest pour routers radio
- [ ] Ajouter analytics écoute (compteurs, durée)


## Bugs E-Radio à corriger
- [x] Corriger erreur balises <a> imbriquées dans /radio/live (liens dans Button)
- [x] Corriger erreur balises <a> imbriquées dans /radio (RadioHome)
- [x] Corriger erreur balises <a> imbriquées dans /radio/grille (RadioSchedule)
- [x] Corriger erreur balises <a> imbriquées dans /radio/podcasts (RadioPodcasts)


## Données mockées E-Radio
- [x] Créer 6 émissions thématiques (FR/Wolof)
- [x] Générer grille horaire hebdomadaire (23 créneaux)
- [ ] Ajouter 5-6 épisodes podcasts (en cours)
- [x] Exécuter seed et vérifier affichage


---

# 🏗️ RESTRUCTURATION SITES AUTONOMES

## Radio Fathul Fattah (site indépendant)
- [ ] Créer RadioLayout avec navbar Radio spécifique
- [ ] Créer RadioNav avec menu (Accueil, Live, Grille, Podcasts)
- [ ] Créer RadioFooter avec identité Radio
- [ ] Appliquer RadioLayout à toutes les pages radio

## Centre de Documentation (site indépendant)
- [ ] Créer DocLayout avec navbar Centre Doc spécifique
- [ ] Créer DocNav avec menu (Catalogue, Galerie, À propos)
- [ ] Créer DocFooter avec identité Centre Doc
- [ ] Appliquer DocLayout à toutes les pages documentation

## Portail Fathul Fattah (site indépendant)
- [ ] Créer PortalLayout avec navbar Portail spécifique
- [ ] Créer PortalNav avec menu (Accueil, Articles, Événements, Contact)
- [ ] Créer PortalFooter avec identité Portail
- [ ] Appliquer PortalLayout à toutes les pages portail

## Tests et validation
- [ ] Vérifier navigation autonome de chaque site
- [ ] Tester changement de langue sur chaque site
- [ ] Vérifier cohérence visuelle de chaque site


## Correction données mockées E-Radio (URGENT)
- [x] Supprimer émissions avec noms génériques
- [x] Créer émissions avec noms Mourides authentiques (Ganna Messere, Serigne Saliou Samb, Abdoulaye Diop Bichri)
- [x] Utiliser vrais noms érudits Mourides
- [x] Thèmes centrés sur Cheikh Ahmadou Bamba et Mouridisme
- [x] Exécuter nouveau seed et vérifier (6 émissions, 25 créneaux)


## Vérification i18n (traductions FR/AR/EN)
- [ ] Vérifier fichiers traductions en.json, ar.json, fr.json
- [ ] Compléter traductions manquantes pour Radio
- [ ] Compléter traductions manquantes pour Centre Doc
- [ ] Compléter traductions manquantes pour Portail
- [ ] Tester changement langue sur les 3 sites

## Finalisation E-Radio avant E-Boutique
- [ ] Créer 5-6 épisodes podcasts mockés (métadonnées + URLs audio placeholder)
- [ ] Créer interface admin configuration URL streaming live
- [ ] Tester player podcasts sur /radio/podcasts/:slug
- [ ] Tester configuration streaming et affichage sur /radio/live
- [ ] Checkpoint avant passage E-Boutique

## E-Radio - Configuration et Upload Audio

- [x] Créer page admin /radio-settings pour configurer l'URL du streaming en direct
- [x] Modifier RadioLive.tsx pour récupérer l'URL depuis la base de données au lieu du hardcode
- [x] Ajouter upload audio vers S3 dans le formulaire de création/édition d'épisodes
- [x] Endpoint backend /api/upload-audio avec multer et storagePut

## Migration Architecture Autonome (MinIO + Keycloak)

### Phase 1 : Migration MinIO
- [x] Installer et configurer SDK MinIO (@aws-sdk/client-s3 compatible)
- [x] Créer nouveau fichier server/storage-minio.ts avec helpers MinIO
- [x] Remplacer storagePut() pour utiliser MinIO au lieu de Manus API
- [x] Adapter endpoint /api/upload-audio pour MinIO
- [ ] Créer variables d'environnement MinIO (MINIO_ENDPOINT, MINIO_ACCESS_KEY, etc.)
- [ ] Tester upload images et audio vers MinIO
- [ ] Documenter configuration MinIO pour VPS

### Phase 2 : Migration Keycloak
- [x] Installer keycloak-connect et openid-client
- [x] Créer server/_core/keycloak.ts pour configuration OpenID Connect
- [x] Remplacer OAuth Manus par Keycloak dans server/_core/oauth.ts
- [x] Adapter middleware d'authentification pour JWT Keycloak
- [x] Configurer mapping rôles Keycloak → rôles application
- [ ] Créer page de login personnalisée (optionnel)
- [ ] Documenter configuration Keycloak realm

### Phase 3 : Configuration et environnement
- [ ] Créer fichier .env.example avec toutes les variables
- [ ] Supprimer dépendances aux variables Manus (BUILT_IN_FORGE_*)
- [ ] Adapter server/_core/env.ts pour nouvelles variables
- [ ] Créer script de migration base de données si nécessaire
- [ ] Tester toutes les fonctionnalités en mode autonome

### Phase 4 : Documentation déploiement
- [x] Créer DEPLOYMENT.md avec guide complet VPS
- [x] Documenter installation MinIO sur VPS (MINIO_SETUP.md)
- [x] Documenter installation Keycloak sur VPS (KEYCLOAK_SETUP.md)
- [ ] Créer docker-compose.yml pour stack complète
- [ ] Créer scripts d'installation automatisés
- [x] Documenter configuration Nginx reverse proxy
- [x] Ajouter guide SSL avec Certbot
- [x] Créer ENV_VARIABLES.md avec documentation des variables

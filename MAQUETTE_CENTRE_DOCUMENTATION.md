# 📚 Maquette Visuelle — Centre de Documentation Fathul Fattah

**Version:** 1.0.0  
**Date:** 05/12/2025  
**Palette:** Vert principal (oklch 0.55 0.15 145) / Doré secondaire (oklch 0.68 0.18 85) / Blanc

---

## 🎯 Vue d'ensemble des parcours utilisateurs

### 1️⃣ Parcours Visiteur Public (Lecteur)

**Objectif:** Trouver un document, consulter sa fiche, demander une copie

```
┌─────────────────────────────────────────────────────────────────┐
│  PARCOURS VISITEUR PUBLIC                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Page d'accueil Portal] → Lien "Catalogue"                    │
│           ↓                                                     │
│  [Page Catalogue Public]                                        │
│   • Barre de recherche principale                              │
│   • Facettes latérales (Auteur, Année, Type, Langue)          │
│   • Grille de résultats (vignettes + métadonnées)             │
│           ↓                                                     │
│  [Page Détail Document]                                         │
│   • Métadonnées complètes (titre, auteur, date, description)  │
│   • Visionneuse PDF/Images intégrée                            │
│   • Bouton "Télécharger" (si autorisé)                        │
│   • Bouton "Demander une reprographie"                        │
│           ↓                                                     │
│  [Formulaire Reprographie]                                      │
│   • Nom complet                                                │
│   • Email                                                       │
│   • Objectif de la demande                                     │
│   • Validation → Email confirmation                            │
│           ↓                                                     │
│  [Confirmation] "Demande enregistrée, vous serez contacté"    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 2️⃣ Parcours Chercheur (Recherche avancée)

**Objectif:** Recherche approfondie, export citations, accès aux scans

```
┌─────────────────────────────────────────────────────────────────┐
│  PARCOURS CHERCHEUR                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Page Catalogue] → Recherche avancée                          │
│   • Filtres multiples combinés:                                │
│     - Auteur: "Cheikh Ahmadou Bamba"                          │
│     - Année: 1900-1950                                         │
│     - Type: Manuscrit                                          │
│     - Langue: Arabe                                            │
│   • Tri par: Pertinence / Date / Titre                        │
│           ↓                                                     │
│  [Résultats filtrés] (12 documents trouvés)                    │
│   • Export citations (BibTeX, APA, Chicago)                    │
│   • Sauvegarder recherche                                      │
│           ↓                                                     │
│  [Détail Document]                                              │
│   • Accès scans haute résolution                               │
│   • Métadonnées enrichies (sujets, identifiants)              │
│   • Documents liés (même auteur, même sujet)                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3️⃣ Parcours Bibliothécaire (Admin)

**Objectif:** Curation, gestion prêts, reprographie, qualité métadonnées

```
┌─────────────────────────────────────────────────────────────────┐
│  PARCOURS BIBLIOTHÉCAIRE (ADMIN)                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Dashboard Admin] → Section "Centre de Documentation"         │
│   • Documents (245)                                             │
│   • Auteurs (87)                                                │
│   • Sujets (34)                                                 │
│   • Exemplaires (412)                                           │
│   • Prêts en cours (23)                                         │
│   • Demandes reprographie (5 en attente)                       │
│           ↓                                                     │
│  [Gestion Documents] (/docs)                                    │
│   • Tableau: Titre, Auteur, Type, Statut, Actions              │
│   • Bouton "Ajouter un document"                               │
│           ↓                                                     │
│  [Formulaire Document]                                          │
│   • Onglet FR: Titre, Description                              │
│   • Onglet AR: العنوان، الوصف                                  │
│   • Onglet EN: Title, Description                              │
│   • Métadonnées: Créateur, Contributeurs, Date, Type          │
│   • Sujets (sélection multiple)                                │
│   • Upload fichiers (PDF, images)                              │
│   • Droits d'accès (Public / Restreint / Privé)               │
│           ↓                                                     │
│  [Gestion Exemplaires] (/copies)                                │
│   • Lier exemplaire physique au document                       │
│   • Code-barres, Localisation (Salle A, Rayon 3)              │
│   • Statut: Disponible / Emprunté / Réparation                │
│           ↓                                                     │
│  [Gestion Prêts] (/loans)                                       │
│   • Scanner code-barres exemplaire                             │
│   • Sélectionner utilisateur                                   │
│   • Date retour prévue (14 jours par défaut)                   │
│   • Bouton "Enregistrer prêt"                                  │
│   • Liste prêts en cours (avec retards en rouge)              │
│   • Bouton "Retour" pour clore prêt                            │
│           ↓                                                     │
│  [Gestion Reprographie] (/repro-requests)                       │
│   • Tableau demandes: Nom, Document, Date, Statut              │
│   • Filtres: En attente / En traitement / Livré                │
│   • Actions: Passer en traitement, Marquer livré               │
│   • Notification automatique au demandeur                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Maquettes Pages Clés

### Page 1: Catalogue Public (`/catalogue`)

```
┌─────────────────────────────────────────────────────────────────┐
│  [Header Portal vert]                                           │
│  FF | Fathul Fattah - Centre de Documentation    [FR/AR/EN]    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  CATALOGUE DE DOCUMENTATION                                     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  🔍 Rechercher dans le catalogue...                       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────┐  ┌──────────────────────────────────────────┐ │
│  │ FILTRES     │  │  RÉSULTATS (245 documents)               │ │
│  ├─────────────┤  ├──────────────────────────────────────────┤ │
│  │ Auteur      │  │  ┌────────────────────────────────────┐  │ │
│  │ ☐ Bamba (45)│  │  │ [📄 Vignette]                      │  │ │
│  │ ☐ Tall (23) │  │  │ Titre: Mawâhib al-Quddûs          │  │ │
│  │             │  │  │ Auteur: Cheikh Ahmadou Bamba      │  │ │
│  │ Année       │  │  │ Date: 1927                         │  │ │
│  │ 1900-1950   │  │  │ Type: Manuscrit | Langue: Arabe   │  │ │
│  │ [====|====] │  │  │ [Voir détail →]                    │  │ │
│  │             │  │  └────────────────────────────────────┘  │ │
│  │ Type        │  │                                          │ │
│  │ ☑ Manuscrit │  │  ┌────────────────────────────────────┐  │ │
│  │ ☐ Livre     │  │  │ [📄 Vignette]                      │  │ │
│  │ ☐ Article   │  │  │ Titre: Masâlik al-Jinân           │  │ │
│  │             │  │  │ Auteur: Cheikh Ahmadou Bamba      │  │ │
│  │ Langue      │  │  │ Date: 1902                         │  │ │
│  │ ☑ Arabe     │  │  │ Type: Manuscrit | Langue: Arabe   │  │ │
│  │ ☐ Français  │  │  │ [Voir détail →]                    │  │ │
│  │ ☐ Wolof     │  │  └────────────────────────────────────┘  │ │
│  └─────────────┘  └──────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Page 2: Détail Document (`/catalogue/:slug`)

```
┌─────────────────────────────────────────────────────────────────┐
│  [Header Portal]                                                │
│  ← Retour au catalogue                                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  MAWÂHIB AL-QUDDÛS                                              │
│  Cheikh Ahmadou Bamba • 1927 • Manuscrit • Arabe               │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐│
│  │ VISIONNEUSE PDF      │  │ MÉTADONNÉES                      ││
│  │                      │  │                                  ││
│  │  [Page 1/45]         │  │ Titre: مواهب القدوس              ││
│  │  ┌────────────────┐  │  │ Créateur: Cheikh Ahmadou Bamba  ││
│  │  │                │  │  │ Date: 1927                       ││
│  │  │   [Scan page]  │  │  │ Type: Manuscrit                  ││
│  │  │                │  │  │ Langue: Arabe                    ││
│  │  │                │  │  │ Sujets: Soufisme, Mouridisme    ││
│  │  └────────────────┘  │  │ Droits: Domaine public          ││
│  │  [< Préc] [Suiv >]  │  │                                  ││
│  │  [Zoom +] [Zoom -]  │  │ Description:                     ││
│  │                      │  │ Poème spirituel composé par...  ││
│  │  [📥 Télécharger]    │  │                                  ││
│  │  [📋 Demander copie] │  │ Exemplaires disponibles:         ││
│  │                      │  │ • Salle A, Rayon 3 (Disponible) ││
│  │                      │  │ • Salle B, Rayon 1 (Emprunté)   ││
│  └──────────────────────┘  └──────────────────────────────────┘│
│                                                                 │
│  DOCUMENTS LIÉS                                                 │
│  [Masâlik al-Jinân] [Jadhb al-Qulûb] [Muqaddima]              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Page 3: Admin - Gestion Documents (`/docs`)

```
┌─────────────────────────────────────────────────────────────────┐
│  [Sidebar Admin]  GESTION DES DOCUMENTS                         │
│                                                                 │
│  [+ Ajouter un document]  [🔍 Rechercher]  [Filtrer ▾]         │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Titre              │ Auteur    │ Type      │ Statut │ ⚙️  │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ Mawâhib al-Quddûs │ Bamba     │ Manuscrit │ Public │ ✏️🗑️│ │
│  │ Masâlik al-Jinân  │ Bamba     │ Manuscrit │ Public │ ✏️🗑️│ │
│  │ Histoire Mourides │ Tall      │ Livre     │ Public │ ✏️🗑️│ │
│  │ Guide spirituel   │ Inconnu   │ Article   │ Privé  │ ✏️🗑️│ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Pagination: [1] [2] [3] ... [12]                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Page 4: Admin - Formulaire Document

```
┌─────────────────────────────────────────────────────────────────┐
│  CRÉER / MODIFIER UN DOCUMENT                                   │
│                                                                 │
│  [FR] [AR] [EN]  ← Onglets langues                             │
│                                                                 │
│  Titre (FR) *                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Les Dons du Très-Saint                                    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Description (FR)                                               │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Poème spirituel composé par Cheikh Ahmadou Bamba...       │ │
│  │                                                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Créateur *              Contributeurs                          │
│  ┌──────────────────┐   ┌──────────────────────────────────┐   │
│  │ Cheikh A. Bamba  │   │ + Ajouter contributeur           │   │
│  └──────────────────┘   └──────────────────────────────────┘   │
│                                                                 │
│  Date *        Type *          Langue *                         │
│  ┌─────────┐  ┌─────────────┐ ┌──────────┐                     │
│  │ 1927    │  │ Manuscrit ▾ │ │ Arabe ▾  │                     │
│  └─────────┘  └─────────────┘ └──────────┘                     │
│                                                                 │
│  Sujets (sélection multiple)                                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ☑ Soufisme  ☑ Mouridisme  ☐ Histoire  ☐ Théologie        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Droits d'accès *                                               │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ○ Public  ○ Restreint  ● Privé                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Fichiers numériques                                            │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 📄 mawahib_scan.pdf (2.3 MB) [🗑️]                         │ │
│  │ [+ Ajouter fichier]                                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [Annuler]  [Enregistrer brouillon]  [Publier]                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Page 5: Admin - Gestion Prêts (`/loans`)

```
┌─────────────────────────────────────────────────────────────────┐
│  [Sidebar Admin]  GESTION DES PRÊTS                             │
│                                                                 │
│  [+ Nouveau prêt]  [Filtrer: Tous ▾]  [Scanner code-barres 📷] │
│                                                                 │
│  PRÊTS EN COURS (23)                                            │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Emprunteur │ Document        │ Retour prévu │ Statut │ ⚙️ │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ A. Diop    │ Mawâhib (Ex.1) │ 15/12/2025   │ ✅     │ 🔙 │ │
│  │ M. Fall    │ Masâlik (Ex.3) │ 10/12/2025   │ ⚠️ -5j │ 🔙 │ │
│  │ F. Ndiaye  │ Histoire (Ex.2)│ 20/12/2025   │ ✅     │ 🔙 │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  HISTORIQUE                                                     │
│  [Voir tous les prêts terminés →]                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Page 6: Admin - Demandes Reprographie (`/repro-requests`)

```
┌─────────────────────────────────────────────────────────────────┐
│  [Sidebar Admin]  DEMANDES DE REPROGRAPHIE                      │
│                                                                 │
│  [Filtrer: En attente ▾]  [Trier: Plus récent ▾]               │
│                                                                 │
│  EN ATTENTE (5)                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Demandeur     │ Document      │ Date      │ Objectif │ ⚙️ │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ Jean Dupont   │ Mawâhib       │ 04/12     │ Recherche│ ▶️ │ │
│  │ marie@ex.com  │               │           │          │    │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ Ali Hassan    │ Masâlik       │ 03/12     │ Étude    │ ▶️ │ │
│  │ ali@ex.com    │               │           │          │    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  EN TRAITEMENT (2)                                              │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Fatou Sall    │ Histoire      │ 01/12     │ Mémoire  │ ✅ │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  LIVRÉES (12)                                                   │
│  [Voir historique →]                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Éléments de Design

### Palette de couleurs

- **Vert principal:** `oklch(0.55 0.15 145)` - Headers, boutons primaires
- **Doré secondaire:** `oklch(0.68 0.18 85)` - Accents, badges statut
- **Blanc:** `oklch(1 0 0)` - Fond principal
- **Gris clair:** `oklch(0.95 0 0)` - Fond sections
- **Gris foncé:** `oklch(0.2 0 0)` - Footer, texte secondaire

### Typographie

- **Titres:** Inter Bold, 24-32px
- **Corps:** Inter Regular, 16px
- **Métadonnées:** Inter Medium, 14px
- **Arabe:** Noto Naskh Arabic, 18px (RTL)

### Icônes

- 📄 Document
- 📚 Catalogue
- 🔍 Recherche
- 📥 Télécharger
- 📋 Reprographie
- 📷 Scanner
- ✏️ Éditer
- 🗑️ Supprimer
- ✅ Validé
- ⚠️ Retard

### Composants clés

1. **Carte Document**
   - Vignette (150x200px)
   - Titre (2 lignes max)
   - Métadonnées (auteur, date, type)
   - Bouton action

2. **Facettes de recherche**
   - Checkboxes
   - Compteurs (nombre résultats)
   - Collapse/expand

3. **Visionneuse PDF**
   - Navigation pages
   - Zoom
   - Téléchargement
   - Plein écran

4. **Formulaire métadonnées**
   - Onglets langues (FR/AR/EN)
   - Champs i18n
   - Upload fichiers
   - Validation

---

## 📊 Statistiques Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  CENTRE DE DOCUMENTATION - STATISTIQUES                         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Documents    │  │ Prêts actifs │  │ Demandes     │          │
│  │    245       │  │     23       │  │ reprographie │          │
│  │              │  │              │  │      5       │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Auteurs      │  │ Exemplaires  │  │ Consultations│          │
│  │     87       │  │    412       │  │  ce mois     │          │
│  │              │  │              │  │    1,234     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist Accessibilité (WCAG 2.1 AA)

- [ ] Contraste texte/fond ≥ 4.5:1
- [ ] Navigation clavier complète
- [ ] Labels ARIA sur tous les champs
- [ ] Alt text sur toutes les images
- [ ] Focus visible sur éléments interactifs
- [ ] Hiérarchie titres (H1 → H6)
- [ ] Support lecteurs d'écran
- [ ] RTL pour contenu arabe
- [ ] Formulaires avec validation accessible

---

## 🚀 Prochaines étapes

1. **Valider maquette** avec équipe Fathul Fattah
2. **Créer schéma base de données** (7 tables)
3. **Implémenter backend tRPC** (routers docs, loans, repro)
4. **Développer pages admin** (CRUD documents, prêts, reprographie)
5. **Développer pages publiques** (catalogue, détail, visionneuse)
6. **Tests & validation** (vitest, accessibilité, performance)

---

**Document préparé par:** Manus AI  
**Pour:** Équipe Fathul Fattah - Hizbut Tarquiyyah

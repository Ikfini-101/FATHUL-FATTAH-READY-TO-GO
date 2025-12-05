-- Migration: Ajout des champs i18n pour le Portal multilingue (FR/AR/EN)
-- Date: 2025-12-05
-- Description: Ajoute les champs JSON pour stocker les traductions

-- 1. Ajouter champs i18n à la table posts (articles)
ALTER TABLE posts 
ADD COLUMN title_i18n JSON COMMENT 'Titres multilingues {fr, ar, en}',
ADD COLUMN excerpt_i18n JSON COMMENT 'Extraits multilingues {fr, ar, en}',
ADD COLUMN body_i18n JSON COMMENT 'Contenus multilingues {fr, ar, en}';

-- 2. Migrer les données existantes vers le format i18n (français par défaut)
UPDATE posts 
SET 
  title_i18n = JSON_OBJECT('fr', title, 'ar', title, 'en', title),
  excerpt_i18n = JSON_OBJECT('fr', COALESCE(excerpt, ''), 'ar', COALESCE(excerpt, ''), 'en', COALESCE(excerpt, '')),
  body_i18n = JSON_OBJECT('fr', content, 'ar', content, 'en', content)
WHERE title_i18n IS NULL;

-- 3. Créer table events pour les événements
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title_i18n JSON NOT NULL COMMENT 'Titres multilingues {fr, ar, en}',
  body_i18n JSON NOT NULL COMMENT 'Descriptions multilingues {fr, ar, en}',
  start_at TIMESTAMP NOT NULL,
  end_at TIMESTAMP NOT NULL,
  location VARCHAR(255),
  status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') DEFAULT 'DRAFT' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP NULL,
  INDEX idx_start_at (start_at),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Créer table pages pour les pages statiques
CREATE TABLE IF NOT EXISTS pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title_i18n JSON NOT NULL COMMENT 'Titres multilingues {fr, ar, en}',
  body_i18n JSON NOT NULL COMMENT 'Contenus multilingues {fr, ar, en}',
  status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') DEFAULT 'DRAFT' NOT NULL,
  author_id INT NOT NULL,
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP NULL,
  INDEX idx_status (status),
  INDEX idx_author_id (author_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Créer table contact_messages pour le formulaire de contact
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(320) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  ip VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  read_at TIMESTAMP NULL,
  replied_at TIMESTAMP NULL,
  INDEX idx_created_at (created_at),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Ajouter champ alt_i18n à la table media
ALTER TABLE media 
ADD COLUMN alt_i18n JSON COMMENT 'Textes alternatifs multilingues {fr, ar, en}';

-- 7. Créer table menus pour la navigation multilingue
CREATE TABLE IF NOT EXISTS menus (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(128) NOT NULL UNIQUE,
  items JSON NOT NULL COMMENT 'Structure du menu avec labels i18n',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Créer table categories_i18n pour les catégories multilingues
ALTER TABLE categories
ADD COLUMN name_i18n JSON COMMENT 'Noms multilingues {fr, ar, en}',
ADD COLUMN description_i18n JSON COMMENT 'Descriptions multilingues {fr, ar, en}';

-- Migrer les données existantes
UPDATE categories 
SET 
  name_i18n = JSON_OBJECT('fr', name, 'ar', name, 'en', name),
  description_i18n = JSON_OBJECT('fr', COALESCE(description, ''), 'ar', COALESCE(description, ''), 'en', COALESCE(description, ''))
WHERE name_i18n IS NULL;

-- 9. Créer table tags_i18n pour les tags multilingues
ALTER TABLE tags
ADD COLUMN name_i18n JSON COMMENT 'Noms multilingues {fr, ar, en}';

-- Migrer les données existantes
UPDATE tags 
SET name_i18n = JSON_OBJECT('fr', name, 'ar', name, 'en', name)
WHERE name_i18n IS NULL;

-- Migration manuelle pour tables E-Radio
-- Ajouter champs i18n et table radioSchedule

-- Ajouter champs i18n à radioShows
ALTER TABLE radioShows 
  ADD COLUMN titleI18n JSON AFTER title,
  ADD COLUMN descriptionI18n JSON AFTER description,
  ADD COLUMN category VARCHAR(64) AFTER descriptionI18n,
  ADD COLUMN status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft' AFTER coverImage,
  DROP COLUMN schedule;

-- Ajouter champs i18n et status à radioEpisodes
ALTER TABLE radioEpisodes
  ADD COLUMN slug VARCHAR(255) NOT NULL UNIQUE AFTER showId,
  ADD COLUMN titleI18n JSON AFTER title,
  ADD COLUMN descriptionI18n JSON AFTER description,
  ADD COLUMN fileSize INT AFTER duration,
  ADD COLUMN status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft' AFTER publishedAt;

-- Créer table radioSchedule
CREATE TABLE IF NOT EXISTS radioSchedule (
  id INT AUTO_INCREMENT PRIMARY KEY,
  showId INT NOT NULL,
  dayOfWeek INT NOT NULL COMMENT '0=Dimanche, 1=Lundi, ..., 6=Samedi',
  startTime VARCHAR(5) NOT NULL COMMENT 'Format HH:MM',
  endTime VARCHAR(5) NOT NULL COMMENT 'Format HH:MM',
  timezone VARCHAR(64) NOT NULL DEFAULT 'Africa/Dakar',
  isRecurring BOOLEAN NOT NULL DEFAULT TRUE,
  startDate TIMESTAMP NULL,
  endDate TIMESTAMP NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_showId (showId),
  INDEX idx_dayOfWeek (dayOfWeek)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

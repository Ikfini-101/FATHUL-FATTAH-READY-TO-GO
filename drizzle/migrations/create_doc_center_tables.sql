-- Tables Centre de Documentation

CREATE TABLE IF NOT EXISTS `doc_items` (
  `id` int AUTO_INCREMENT NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
  `title_i18n` json NOT NULL,
  `description_i18n` json,
  `creator` varchar(255),
  `contributor` varchar(255),
  `publisher` varchar(255),
  `date` varchar(100),
  `type` varchar(50) NOT NULL,
  `format` varchar(100),
  `identifier` varchar(255),
  `source` varchar(255),
  `language` varchar(10),
  `relation` varchar(255),
  `coverage` varchar(255),
  `rights` text,
  `collection` varchar(255),
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `author_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL,
  CONSTRAINT `doc_items_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `persons` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(100),
  `affiliation` varchar(255),
  `bio_i18n` json,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `persons_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `subjects` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name_i18n` json NOT NULL,
  `parent_id` int,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `subjects_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `copies` (
  `id` int AUTO_INCREMENT NOT NULL,
  `doc_item_id` int NOT NULL,
  `barcode` varchar(100) NOT NULL UNIQUE,
  `location` varchar(255),
  `status` enum('available','loaned','reserved','damaged','lost') NOT NULL DEFAULT 'available',
  `notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `copies_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `loans` (
  `id` int AUTO_INCREMENT NOT NULL,
  `copy_id` int NOT NULL,
  `borrower_name` varchar(255) NOT NULL,
  `borrower_email` varchar(320) NOT NULL,
  `borrower_id` varchar(100),
  `loaned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `due_at` timestamp NOT NULL,
  `returned_at` timestamp NULL,
  `notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `loans_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `repro_requests` (
  `id` int AUTO_INCREMENT NOT NULL,
  `doc_item_id` int NOT NULL,
  `requester_name` varchar(255) NOT NULL,
  `requester_email` varchar(320) NOT NULL,
  `purpose` text NOT NULL,
  `status` enum('received','processing','completed','delivered','cancelled') NOT NULL DEFAULT 'received',
  `files` json,
  `notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `repro_requests_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `file_assets` (
  `id` int AUTO_INCREMENT NOT NULL,
  `doc_item_id` int NOT NULL,
  `file_url` varchar(512) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `file_size` int,
  `mime_type` varchar(100),
  `alt_i18n` json,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `file_assets_id` PRIMARY KEY(`id`)
);

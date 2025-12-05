CREATE TABLE `contact_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`subject` varchar(255),
	`message` text NOT NULL,
	`ip` varchar(45),
	`user_agent` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`read_at` timestamp,
	`replied_at` timestamp,
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title_i18n` json NOT NULL,
	`body_i18n` json NOT NULL,
	`start_at` timestamp NOT NULL,
	`end_at` timestamp NOT NULL,
	`location` varchar(255),
	`status` enum('DRAFT','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `events_id` PRIMARY KEY(`id`),
	CONSTRAINT `events_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `menus` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`items` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `menus_id` PRIMARY KEY(`id`),
	CONSTRAINT `menus_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title_i18n` json NOT NULL,
	`body_i18n` json NOT NULL,
	`status` enum('DRAFT','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
	`author_id` int NOT NULL,
	`published_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `pages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `categories` ADD `name_i18n` json;--> statement-breakpoint
ALTER TABLE `categories` ADD `description_i18n` json;--> statement-breakpoint
ALTER TABLE `media` ADD `alt_i18n` json;--> statement-breakpoint
ALTER TABLE `posts` ADD `title_i18n` json;--> statement-breakpoint
ALTER TABLE `posts` ADD `excerpt_i18n` json;--> statement-breakpoint
ALTER TABLE `posts` ADD `body_i18n` json;--> statement-breakpoint
ALTER TABLE `tags` ADD `name_i18n` json;
CREATE TABLE `accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(64) NOT NULL,
	`provider` varchar(64) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refreshToken` text,
	`accessToken` text,
	`expiresAt` int,
	`tokenType` varchar(64),
	`scope` text,
	`idToken` text,
	`sessionState` text,
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `activityLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(128) NOT NULL,
	`resource` varchar(64) NOT NULL,
	`resourceId` int,
	`ipAddress` varchar(45),
	`userAgent` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activityLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`slug` varchar(128) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`filename` varchar(255) NOT NULL,
	`originalName` varchar(255) NOT NULL,
	`mimeType` varchar(128) NOT NULL,
	`size` int NOT NULL,
	`url` text NOT NULL,
	`uploadedBy` int NOT NULL,
	`alt` text,
	`caption` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`deletedAt` timestamp,
	CONSTRAINT `media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL,
	`price` int NOT NULL,
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`subtotal` int NOT NULL,
	`tax` int NOT NULL,
	`total` int NOT NULL,
	`status` enum('PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`description` text,
	`resource` varchar(64) NOT NULL,
	`action` varchar(32) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `permissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `permissions_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `postCategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`categoryId` int NOT NULL,
	CONSTRAINT `postCategories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `postTags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`tagId` int NOT NULL,
	CONSTRAINT `postTags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`authorId` int NOT NULL,
	`status` enum('DRAFT','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
	`publishedAt` timestamp,
	`metaTitle` varchar(255),
	`metaDescription` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deletedAt` timestamp,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`price` int NOT NULL,
	`stock` int NOT NULL DEFAULT 0,
	`images` json,
	`status` enum('DRAFT','PUBLISHED','OUT_OF_STOCK','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
	`featured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deletedAt` timestamp,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `radioEpisodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`showId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`audioUrl` text NOT NULL,
	`duration` int NOT NULL,
	`publishedAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `radioEpisodes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `radioShows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`schedule` varchar(255),
	`duration` int,
	`hostName` varchar(128),
	`coverImage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `radioShows_id` PRIMARY KEY(`id`),
	CONSTRAINT `radioShows_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `rolePermissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roleId` int NOT NULL,
	`permissionId` int NOT NULL,
	`grantedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rolePermissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionToken` varchar(255) NOT NULL,
	`userId` int NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_sessionToken_unique` UNIQUE(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL,
	`slug` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_name_unique` UNIQUE(`name`),
	CONSTRAINT `tags_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `userRoles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`roleId` int NOT NULL,
	`assignedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userRoles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verificationTokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `verificationTokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `verificationTokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `vrArtifacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`exhibitionId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`modelUrl` text NOT NULL,
	`thumbnailUrl` text,
	`positionX` int,
	`positionY` int,
	`positionZ` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vrArtifacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vrExhibitions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`sceneUrl` text NOT NULL,
	`thumbnailUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vrExhibitions_id` PRIMARY KEY(`id`),
	CONSTRAINT `vrExhibitions_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `emailVerified` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `image` text;--> statement-breakpoint
ALTER TABLE `users` ADD `password` text;--> statement-breakpoint
ALTER TABLE `users` ADD `deletedAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);
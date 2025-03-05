CREATE TABLE `guild` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`external_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `item` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`guild_id` integer NOT NULL,
	FOREIGN KEY (`guild_id`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade
);

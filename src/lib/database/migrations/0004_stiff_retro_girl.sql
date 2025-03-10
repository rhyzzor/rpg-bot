CREATE TABLE `player` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`external_id` text,
	`guild_id` text NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`stats` text
);

DROP TABLE `guild`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_item` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`url` text DEFAULT 'https://thumbs.dreamstime.com/b/povos-3d-brancos-com-um-ponto-de-interroga%C3%A7%C3%A3o-27709668.jpg' NOT NULL,
	`guild_id` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_item`("id", "name", "description", "url", "guild_id") SELECT "id", "name", "description", "url", "guild_id" FROM `item`;--> statement-breakpoint
DROP TABLE `item`;--> statement-breakpoint
ALTER TABLE `__new_item` RENAME TO `item`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
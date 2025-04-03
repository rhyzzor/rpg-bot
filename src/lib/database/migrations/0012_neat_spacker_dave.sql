PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_inventory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`player_id` integer NOT NULL,
	`item_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`guild_id` text NOT NULL,
	FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_inventory`("id", "player_id", "item_id", "quantity", "guild_id") SELECT "id", "player_id", "item_id", "quantity", "guild_id" FROM `inventory`;--> statement-breakpoint
DROP TABLE `inventory`;--> statement-breakpoint
ALTER TABLE `__new_inventory` RENAME TO `inventory`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `inventory_guild_id_item_id_player_id_unique` ON `inventory` (`guild_id`,`item_id`,`player_id`);
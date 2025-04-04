ALTER TABLE `player` RENAME COLUMN "class_id" TO "class_name";--> statement-breakpoint
DROP TABLE `class`;--> statement-breakpoint
DROP INDEX "inventory_guild_id_item_id_player_id_unique";--> statement-breakpoint
ALTER TABLE `player` ALTER COLUMN "class_name" TO "class_name" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `inventory_guild_id_item_id_player_id_unique` ON `inventory` (`guild_id`,`item_id`,`player_id`);
ALTER TABLE `player` RENAME COLUMN "class_name" TO "class_id";--> statement-breakpoint
DROP INDEX "inventory_guild_id_item_id_player_id_unique";--> statement-breakpoint
ALTER TABLE `player` ALTER COLUMN "class_id" TO "class_id" integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `inventory_guild_id_item_id_player_id_unique` ON `inventory` (`guild_id`,`item_id`,`player_id`);
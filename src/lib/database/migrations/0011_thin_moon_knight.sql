DROP INDEX "inventory_guild_id_item_id_player_id_unique";--> statement-breakpoint
ALTER TABLE `class` ALTER COLUMN "guild_id" TO "guild_id" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `inventory_guild_id_item_id_player_id_unique` ON `inventory` (`guild_id`,`item_id`,`player_id`);
ALTER TABLE `player` ADD `level` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `player` ADD `hp` integer DEFAULT 30 NOT NULL;--> statement-breakpoint
ALTER TABLE `player` ADD `status` text DEFAULT 'alive' NOT NULL;
CREATE TABLE `class` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`url` text DEFAULT 'https://thumbs.dreamstime.com/b/povos-3d-brancos-com-um-ponto-de-interroga%C3%A7%C3%A3o-27709668.jpg' NOT NULL,
	`guild_id` text NOT NULL,
	`stats` text
);
--> statement-breakpoint
ALTER TABLE `player` ADD `class_id` integer NOT NULL REFERENCES class(id);--> statement-breakpoint
ALTER TABLE `player` ADD `background` text NOT NULL;--> statement-breakpoint
ALTER TABLE `player` ADD `extra_details` text;
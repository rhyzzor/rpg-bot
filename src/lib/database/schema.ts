import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const itemTable = sqliteTable("item", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	description: text("description").notNull(),
	url: text("url")
		.notNull()
		.default(
			"https://thumbs.dreamstime.com/b/povos-3d-brancos-com-um-ponto-de-interroga%C3%A7%C3%A3o-27709668.jpg",
		),
	guildId: text("guild_id").notNull(),
});

export type ItemDTO = typeof itemTable.$inferSelect;

type StatsType = {
	label: string;
	value: number;
};

export const classTable = sqliteTable("class", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	description: text("description").notNull(),
	url: text("url")
		.notNull()
		.default(
			"https://thumbs.dreamstime.com/b/povos-3d-brancos-com-um-ponto-de-interroga%C3%A7%C3%A3o-27709668.jpg",
		),
	stats: text("stats", { mode: "json" }).$type<StatsType[]>().notNull(),
});

export const playerTable = sqliteTable("player", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	externalId: text("external_id"),
	guildId: text("guild_id").notNull(),
	classId: integer("class_id")
		.references(() => classTable.id)
		.notNull(),
	name: text("name").notNull(),
	url: text("url").notNull(),
	background: text("background").notNull(),
	extraDetails: text("extra_details"),
	stats: text("stats", { mode: "json" }).$type<StatsType[]>().notNull(),
});

export const inventoryTable = sqliteTable("inventory", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	playerId: integer("player_id")
		.references(() => playerTable.id)
		.notNull(),
	itemId: integer("item_id")
		.references(() => itemTable.id)
		.notNull(),
	quantity: integer("quantity").notNull(),
	guildId: text("guild_id").notNull(),
});

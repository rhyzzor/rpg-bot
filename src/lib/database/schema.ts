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

export const playerTable = sqliteTable("player", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	externalId: text("external_id"),
	guildId: text("guild_id").notNull(),
	name: text("name").notNull(),
	url: text("url").notNull(),
	stats: text("stats", { mode: "json" }).$type<StatsType[]>(),
});

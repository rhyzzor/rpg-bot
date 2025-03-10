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

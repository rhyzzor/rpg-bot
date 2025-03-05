import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const guildTable = sqliteTable("guild", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	externalId: text("external_id").notNull().unique(),
});

export const itemTable = sqliteTable("item", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	description: text("description").notNull(),
	url: text("url")
		.notNull()
		.default(
			"https://thumbs.dreamstime.com/b/povos-3d-brancos-com-um-ponto-de-interroga%C3%A7%C3%A3o-27709668.jpg",
		),
	guildId: integer("guild_id")
		.references(() => guildTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
});

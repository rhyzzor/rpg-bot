import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const guildTable = sqliteTable("guild", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	externalId: text("external_id").notNull(),
});

export const itemTable = sqliteTable("item", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	description: text("description").notNull(),
	guildId: integer("guild_id")
		.references(() => guildTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
});

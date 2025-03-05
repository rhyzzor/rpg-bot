import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const itemTable = sqliteTable("item", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	description: text("description").notNull(),
});

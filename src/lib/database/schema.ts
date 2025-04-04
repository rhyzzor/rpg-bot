import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

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

export type StatsType = {
	label: string;
	value: number;
};

export const playerTable = sqliteTable("player", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	level: integer("level").notNull().default(1),
	hp: integer("hp").notNull().default(30),
	status: text("status", { enum: ["alive", "dead"] })
		.notNull()
		.default("alive"),
	mana: integer("mana").notNull().default(40),
	externalId: text("external_id"),
	guildId: text("guild_id").notNull(),
	classId: integer("class_id").notNull(),
	name: text("name").notNull(),
	url: text("url").notNull(),
	background: text("background").notNull(),
	extraDetails: text("extra_details"),
	stats: text("stats", { mode: "json" }).$type<StatsType[]>().notNull(),
	points: integer("points").notNull().default(0),
});

export type PlayerDTO = typeof playerTable.$inferSelect;

export const inventoryTable = sqliteTable(
	"inventory",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		playerId: integer("player_id")
			.references(() => playerTable.id, { onDelete: "cascade" })
			.notNull(),
		itemId: integer("item_id")
			.references(() => itemTable.id, { onDelete: "cascade" })
			.notNull(),
		quantity: integer("quantity").notNull(),
		guildId: text("guild_id").notNull(),
	},
	(t) => [unique().on(t.guildId, t.itemId, t.playerId)],
);

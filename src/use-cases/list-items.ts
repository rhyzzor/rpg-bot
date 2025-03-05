import { db } from "@/lib/database/drizzle";
import { guildTable, itemTable } from "@/lib/database/schema";
import { asc, eq } from "drizzle-orm";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface ListItemProps {
	guildExternalId: string;
}

export async function listItemsUseCase({ guildExternalId }: ListItemProps) {
	const guild = await db
		.select({ id: guildTable.id })
		.from(guildTable)
		.where(eq(guildTable.externalId, guildExternalId))
		.get();

	if (!guild) {
		throw new ResourceNotFoundError();
	}

	const items = await db
		.select()
		.from(itemTable)
		.where(eq(itemTable.guildId, guild.id))
		.orderBy(asc(itemTable.name));

	return items;
}

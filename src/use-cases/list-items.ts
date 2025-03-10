import { db } from "@/lib/database/drizzle";
import { itemTable } from "@/lib/database/schema";
import { asc, eq } from "drizzle-orm";

interface ListItemProps {
	guildExternalId: string;
}

export async function listItemsUseCase({ guildExternalId }: ListItemProps) {
	const items = await db
		.select()
		.from(itemTable)
		.where(eq(itemTable.guildId, guildExternalId))
		.orderBy(asc(itemTable.name));

	return items;
}

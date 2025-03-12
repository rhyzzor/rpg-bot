import { db } from "@/lib/database/drizzle";
import { itemTable } from "@/lib/database/schema";
import { asc, eq } from "drizzle-orm";

interface ListItemProps {
	guildId: string;
}

export async function listItemsUseCase({ guildId }: ListItemProps) {
	const items = await db
		.select()
		.from(itemTable)
		.where(eq(itemTable.guildId, guildId))
		.orderBy(asc(itemTable.name));

	return items;
}

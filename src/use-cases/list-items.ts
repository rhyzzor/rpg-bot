import { itemCache } from "@/lib/cache";
import { db } from "@/lib/database/drizzle";
import { type ItemDTO, itemTable } from "@/lib/database/schema";
import { asc, eq } from "drizzle-orm";

interface ListItemProps {
	guildId: string;
}

export async function listItemsUseCase({ guildId }: ListItemProps) {
	const hasCache = await itemCache.has(guildId);

	if (hasCache) {
		const items = await itemCache.get<ItemDTO[]>(guildId);

		if (items) return items;
	}

	const items = await db
		.select()
		.from(itemTable)
		.where(eq(itemTable.guildId, guildId))
		.orderBy(asc(itemTable.name));

	await itemCache.set(guildId, items);

	return items;
}

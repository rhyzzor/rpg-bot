import { itemCache } from "@/lib/cache";
import { db } from "@/lib/database/drizzle";
import { itemTable } from "@/lib/database/schema";

interface CreateItemProps {
	guildId: string;
	name: string;
	description: string;
	url: string;
}

export async function createItemUseCase({
	guildId,
	name,
	url,
	description,
}: CreateItemProps) {
	await db.insert(itemTable).values({
		description,
		guildId,
		url,
		name,
	});

	await itemCache.delete(guildId);
}

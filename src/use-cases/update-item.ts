import { itemCache } from "@/lib/cache";
import { db } from "@/lib/database/drizzle";
import { itemTable } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";

interface EditItemProps {
	id: number;
	name: string;
	description: string;
	url: string;
	guildId: string;
}

export async function updateItemUseCase({
	id,
	name,
	description,
	guildId,
	url,
}: EditItemProps) {
	const item = await db
		.update(itemTable)
		.set({
			name,
			description,
			url,
		})
		.where(and(eq(itemTable.id, id), eq(itemTable.guildId, guildId)))
		.returning()
		.get();

	if (item) {
		await itemCache.delete(guildId);
	}
}

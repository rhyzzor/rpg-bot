import { itemCache, sheetCache } from "@/lib/cache";
import { db } from "@/lib/database/drizzle";
import { itemTable } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";

interface DeleteItemProps {
	id: number;
	guildId: string;
}

export async function deleteItemUseCase({ id, guildId }: DeleteItemProps) {
	await db
		.delete(itemTable)
		.where(and(eq(itemTable.id, id), eq(itemTable.guildId, guildId)));

	await Promise.all([itemCache.delete(guildId), sheetCache.delete(guildId)]);
}

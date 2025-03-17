import { db } from "@/lib/database/drizzle";
import { inventoryTable, itemTable, playerTable } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";

interface FindPlayerProps {
	externalId?: string;
	guildId: string;
	id?: number;
}

export async function findPlayerUseCase({
	externalId,
	guildId,
	id,
}: FindPlayerProps) {
	const player = await db
		.select()
		.from(playerTable)
		.where(
			and(
				eq(playerTable.guildId, guildId),
				externalId ? eq(playerTable.externalId, externalId) : undefined,
				id ? eq(playerTable.id, id) : undefined,
			),
		)
		.get();

	if (!player) return;

	const inventory = await db
		.select({
			id: inventoryTable.id,
			itemName: itemTable.name,
			itemId: inventoryTable.itemId,
			quantity: inventoryTable.quantity,
		})
		.from(inventoryTable)
		.innerJoin(itemTable, eq(inventoryTable.itemId, itemTable.id))
		.where(eq(inventoryTable.playerId, player.id));

	return { ...player, inventory };
}

import { sheetCache } from "@/lib/cache";
import { db } from "@/lib/database/drizzle";
import { inventoryTable } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { findPlayerUseCase } from "./find-player";

interface CreateInventoryProps {
	guildId: string;
	itemId: number;
	playerId: number;
	quantity: number;
}

export async function createInventoryUseCase({
	guildId,
	itemId,
	playerId,
	quantity,
}: CreateInventoryProps) {
	if (quantity === 0) {
		await db
			.delete(inventoryTable)
			.where(
				and(
					eq(inventoryTable.guildId, guildId),
					eq(inventoryTable.itemId, itemId),
					eq(inventoryTable.playerId, playerId),
				),
			);

		return;
	}

	await db
		.insert(inventoryTable)
		.values({ guildId, itemId, playerId, quantity })
		.onConflictDoUpdate({
			target: [
				inventoryTable.guildId,
				inventoryTable.itemId,
				inventoryTable.playerId,
			],
			set: {
				quantity,
			},
		});

	await sheetCache.delete(guildId);

	const player = await findPlayerUseCase({ guildId, id: playerId });

	return player;
}

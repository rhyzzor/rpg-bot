import { db } from "@/lib/database/drizzle";
import { inventoryTable } from "@/lib/database/schema";
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

	const player = await findPlayerUseCase({ guildId, id: playerId });

	return player;
}

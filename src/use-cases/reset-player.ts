import { sheetCache } from "@/lib/cache";
import { db } from "@/lib/database/drizzle";
import { inventoryTable, playerTable } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";

interface ResetPlayerProps {
	playerId: number;
	guildId: string;
}

export async function resetPlayerUseCase({
	playerId,
	guildId,
}: ResetPlayerProps) {
	const stats = [
		{ label: "Strength", value: 1 },
		{ label: "Dexterity", value: 1 },
		{ label: "Constitution", value: 1 },
		{ label: "Intelligence", value: 1 },
		{ label: "Wisdom", value: 1 },
		{ label: "Charisma", value: 1 },
	];

	const sheet = await db.transaction(async (tx) => {
		const sheet = await tx
			.update(playerTable)
			.set({ points: 0, stats })
			.where(
				and(eq(playerTable.id, playerId), eq(playerTable.guildId, guildId)),
			)
			.returning()
			.get();

		await tx
			.delete(inventoryTable)
			.where(
				and(
					eq(inventoryTable.guildId, guildId),
					eq(inventoryTable.playerId, playerId),
				),
			);

		return sheet;
	});

	if (sheet) {
		await sheetCache.delete(guildId);
	}

	return sheet;
}

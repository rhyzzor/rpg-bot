import { sheetCache } from "@/lib/cache";
import { db } from "@/lib/database/drizzle";
import { type StatsType, playerTable } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";

interface UpdatePlayerStatsProps {
	playerId: number;
	guildId: string;
	stats: StatsType[];
	points?: number;
	hp?: number;
	mana?: number;
}
export async function updatePlayerStatsUseCase({
	playerId,
	guildId,
	stats,
	hp,
	mana,
	points,
}: UpdatePlayerStatsProps) {
	const player = await db
		.update(playerTable)
		.set({
			stats,
			hp,
			mana,
			points,
		})
		.where(and(eq(playerTable.id, playerId), eq(playerTable.guildId, guildId)))
		.returning()
		.get();

	if (player) {
		await sheetCache.delete(guildId);
	}
}

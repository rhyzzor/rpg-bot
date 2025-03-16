import { db } from "@/lib/database/drizzle";
import { type StatsType, playerTable } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";

interface UpdatePlayerStatsProps {
	playerId: number;
	guildId: string;
	stats: StatsType[];
	points: number;
}
export async function UpdatePlayerStatsUseCase({
	playerId,
	guildId,
	stats,
	points,
}: UpdatePlayerStatsProps) {
	await db
		.update(playerTable)
		.set({ stats, points })
		.where(and(eq(playerTable.id, playerId), eq(playerTable.guildId, guildId)));
}

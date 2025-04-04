import { sheetCache } from "@/lib/cache";
import { db } from "@/lib/database/drizzle";
import { playerTable } from "@/lib/database/schema";
import { and, eq, sql } from "drizzle-orm";

interface SendPointProps {
	guildId: string;
	playerId: number;
	quantity: number;
}

export async function sendPointUseCase({
	guildId,
	playerId,
	quantity,
}: SendPointProps) {
	const player = await db
		.update(playerTable)
		.set({
			points: sql`${playerTable.points} + ${quantity}`,
			hp: sql`${playerTable.hp} + ${quantity * 5}`,
			mana: sql`${playerTable.mana} + ${quantity * 5}`,
			level: sql`${playerTable.level} + ${quantity}`,
		})
		.where(and(eq(playerTable.id, playerId), eq(playerTable.guildId, guildId)))
		.returning()
		.get();

	if (player) {
		await sheetCache.delete(guildId);
	}

	return player;
}

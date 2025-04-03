import { db } from "@/lib/database/drizzle";
import { playerTable } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";

interface RestorePlayerProps {
	playerId: number;
	guildId: string;
	mana: number;
	hp: number;
}

export async function restorePlayerUseCase({
	playerId,
	guildId,
	hp,
	mana,
}: RestorePlayerProps) {
	return await db
		.update(playerTable)
		.set({
			mana,
			hp,
		})
		.where(and(eq(playerTable.id, playerId), eq(playerTable.guildId, guildId)))
		.returning()
		.get();
}

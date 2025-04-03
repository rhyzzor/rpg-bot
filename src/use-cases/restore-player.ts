import { db } from "@/lib/database/drizzle";
import { playerTable } from "@/lib/database/schema";
import { and, eq, sql } from "drizzle-orm";

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
	const player = await db.transaction(async (tx) => {
		const updated = await tx
			.update(playerTable)
			.set({
				mana: sql`${playerTable.mana} + ${mana}`,
				hp: sql`${playerTable.hp} + ${hp}`,
			})
			.where(
				and(eq(playerTable.id, playerId), eq(playerTable.guildId, guildId)),
			)
			.returning()
			.get();

		if (updated.hp > 0) {
			await tx
				.update(playerTable)
				.set({ status: "alive" })
				.where(eq(playerTable.id, updated.id));
		}

		return updated;
	});

	return player;
}

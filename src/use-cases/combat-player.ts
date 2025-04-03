import { db } from "@/lib/database/drizzle";
import { playerTable } from "@/lib/database/schema";
import { and, eq, sql } from "drizzle-orm";

interface CombatPlayerProps {
	playerId: number;
	guildId: string;
	hp: number;
	mana: number;
}

export async function combatPlayerUseCase({
	playerId,
	guildId,
	hp,
	mana,
}: CombatPlayerProps) {
	const player = await db.transaction(async (tx) => {
		const player = await tx
			.update(playerTable)
			.set({
				mana: sql`${playerTable.mana} - ${mana}`,
				hp: sql`${playerTable.hp} - ${hp}`,
			})
			.where(
				and(eq(playerTable.id, playerId), eq(playerTable.guildId, guildId)),
			)
			.returning()
			.get();

		if (player.hp <= 0) {
			await tx
				.update(playerTable)
				.set({ hp: 0, status: "dead" })
				.where(eq(playerTable.id, playerId))
				.returning()
				.get();
		}

		return player;
	});

	return player;
}

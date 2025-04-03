import { calculateHpAndMana } from "@/helpers/calculate-hp-and-mana";
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

		const { hp: maxHp, mana: maxMana } = calculateHpAndMana(updated);

		if (maxHp < updated.hp && updated.externalId) {
			await tx
				.update(playerTable)
				.set({ hp: maxHp })
				.where(eq(playerTable.id, updated.id));
		}

		if (maxMana < updated.mana && updated.externalId) {
			await tx
				.update(playerTable)
				.set({ mana: maxMana })
				.where(eq(playerTable.id, updated.id));
		}

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

import { db } from "@/lib/database/drizzle";
import { playerTable } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { findClassUseCase } from "./find-class";

interface ChangePlayerClassProps {
	playerId: number;
	classId: number;
	guildId: string;
}

export async function changePlayerClassUseCase({
	playerId,
	classId,
	guildId,
}: ChangePlayerClassProps) {
	const selectedClass = findClassUseCase({ classId, locale: "pt-BR" });

	if (!selectedClass) {
		throw new ResourceNotFoundError();
	}

	const constitution =
		selectedClass.stats.find(
			(stat) => stat.label.toLowerCase() === "constitution",
		)?.value ?? 0;

	const intelligence =
		selectedClass.stats.find(
			(stat) => stat.label.toLowerCase() === "intelligence",
		)?.value ?? 0;

	const hp = 30 + constitution * 3;
	const mana = 40 + intelligence * 3;

	const player = await db
		.update(playerTable)
		.set({
			classId,
			stats: selectedClass.stats,
			points: 0,
			hp,
			mana,
			level: 1,
		})
		.where(and(eq(playerTable.id, playerId), eq(playerTable.guildId, guildId)))
		.returning()
		.get();

	return player;
}

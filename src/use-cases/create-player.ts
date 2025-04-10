import classJSON from "@/assets/class.json";
import { sheetCache } from "@/lib/cache";
import { db } from "@/lib/database/drizzle";
import { playerTable } from "@/lib/database/schema";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CreatePlayerProps {
	guildId: string;
	externalId?: string;
	name: string;
	background: string;
	url: string;
	extraDetails?: string;
	classId: number;
}

export async function createPlayerUseCase(data: CreatePlayerProps) {
	const selectedClass = classJSON.find((c) => c.id === data.classId);

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

	await db.insert(playerTable).values({
		...data,
		stats: selectedClass.stats,
		hp,
		mana,
		level: 1,
		points: 0,
	});

	await sheetCache.delete(data.guildId);
}

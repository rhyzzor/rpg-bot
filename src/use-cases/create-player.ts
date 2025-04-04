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

	await db.insert(playerTable).values({
		...data,
		stats: selectedClass.stats,
	});

	await sheetCache.delete(data.guildId);
}

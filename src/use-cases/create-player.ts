import { db } from "@/lib/database/drizzle";
import { classTable, playerTable } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
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
	const selectedClass = await db
		.select()
		.from(classTable)
		.where(eq(classTable.id, data.classId))
		.get();

	if (!selectedClass) {
		throw new ResourceNotFoundError();
	}

	await db.insert(playerTable).values({ ...data, stats: selectedClass.stats });
}

import { db } from "@/lib/database/drizzle";
import { classTable } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";

interface FindClassProps {
	id: number;
	guildId: string;
}

export async function findClassUseCase({ id, guildId }: FindClassProps) {
	const selectedClass = await db
		.select()
		.from(classTable)
		.where(and(eq(classTable.id, id), eq(classTable.guildId, guildId)))
		.get();

	return selectedClass;
}

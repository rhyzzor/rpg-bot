import { classCache } from "@/lib/cache";
import { db } from "@/lib/database/drizzle";
import { type ClassDTO, classTable } from "@/lib/database/schema";
import { asc, eq } from "drizzle-orm";

interface ListClassesProps {
	guildId: string;
}

export async function listClassesUseCase({ guildId }: ListClassesProps) {
	const hasCache = await classCache.has(guildId);

	if (hasCache) {
		const classes = await classCache.get<ClassDTO[]>(guildId);

		if (classes) return classes;
	}

	const classes = await db
		.select()
		.from(classTable)
		.where(eq(classTable.guildId, guildId))
		.orderBy(asc(classTable.name));

	await classCache.set(guildId, classes);

	return classes;
}

import { db } from "@/lib/database/drizzle";
import { classTable } from "@/lib/database/schema";
import { asc, eq } from "drizzle-orm";

interface ListClassesProps {
	guildId: string;
}

export async function listClassesUseCase({ guildId }: ListClassesProps) {
	const classes = await db
		.select()
		.from(classTable)
		.where(eq(classTable.guildId, guildId))
		.orderBy(asc(classTable.name));

	//TODO: business rules

	return classes;
}

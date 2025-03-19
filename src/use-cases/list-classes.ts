import { db } from "@/lib/database/drizzle";
import { classTable } from "@/lib/database/schema";
import { eq } from "drizzle-orm";

interface ListClassesProps {
	guildId: string;
}

export async function listClassesUseCase({ guildId }: ListClassesProps) {
	const classes = await db
		.select()
		.from(classTable)
		.where(eq(classTable.guildId, guildId));

	//TODO: business rules

	return classes;
}

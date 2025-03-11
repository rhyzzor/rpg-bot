import { db } from "@/lib/database/drizzle";
import { classTable } from "@/lib/database/schema";

interface ListClassesProps {
	guildId: string;
}

export async function listClassesUseCase({ guildId }: ListClassesProps) {
	const classes = await db.select().from(classTable);

	//TODO: business rules

	return classes;
}

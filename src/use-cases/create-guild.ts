import { db } from "@/lib/database/drizzle";
import { guildTable } from "@/lib/database/schema";

export async function createGuildUseCase(externalId: string) {
	await db.insert(guildTable).values({ externalId }).onConflictDoNothing();
}

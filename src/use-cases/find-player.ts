import { db } from "@/lib/database/drizzle";
import { playerTable } from "@/lib/database/schema";
import { eq } from "drizzle-orm";

interface FindPlayerProps {
	externalId: string;
}

export async function findPlayerUseCase({ externalId }: FindPlayerProps) {
	const player = await db
		.select()
		.from(playerTable)
		.where(eq(playerTable.externalId, externalId))
		.get();

	return player;
}

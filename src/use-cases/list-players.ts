import { db } from "@/lib/database/drizzle";
import { playerTable } from "@/lib/database/schema";
import { asc, eq } from "drizzle-orm";

interface ListPlayersProps {
	guildId: string;
}

export async function listPlayersUseCase({ guildId }: ListPlayersProps) {
	const players = await db
		.select()
		.from(playerTable)
		.where(eq(playerTable.guildId, guildId))
		.orderBy(asc(playerTable.name));

	return players;
}

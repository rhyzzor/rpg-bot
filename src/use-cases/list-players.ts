import { sheetCache } from "@/lib/cache";
import { db } from "@/lib/database/drizzle";
import { type PlayerDTO, playerTable } from "@/lib/database/schema";
import { asc, eq } from "drizzle-orm";

interface ListPlayersProps {
	guildId: string;
}

export async function listPlayersUseCase({ guildId }: ListPlayersProps) {
	const hasCache = await sheetCache.has(guildId);

	if (hasCache) {
		const sheets = await sheetCache.get<PlayerDTO[]>(guildId);

		console.log("sheets", sheets?.length);

		if (sheets) return sheets;
	}

	const players = await db
		.select()
		.from(playerTable)
		.where(eq(playerTable.guildId, guildId))
		.orderBy(asc(playerTable.name));

	console.log("setou cache");
	await sheetCache.set(guildId, players);

	return players;
}

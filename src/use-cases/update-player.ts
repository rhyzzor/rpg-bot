import { db } from "@/lib/database/drizzle";
import { playerTable } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";

interface UpdatePlayerProps {
	id: number;
	guildId: string;
	name: string;
	url: string;
	background: string;
	extraDetails?: string | null;
}

export async function updatePlayerUseCase({
	background,
	guildId,
	id,
	name,
	url,
	extraDetails,
}: UpdatePlayerProps) {
	const player = await db
		.update(playerTable)
		.set({ background, name, url, extraDetails })
		.where(and(eq(playerTable.id, id), eq(playerTable.guildId, guildId)))
		.returning()
		.get();

	return player;
}

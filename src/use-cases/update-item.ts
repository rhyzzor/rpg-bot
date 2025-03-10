import { db } from "@/lib/database/drizzle";
import { guildTable, itemTable } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface EditItemProps {
	id: number;
	name: string;
	description: string;
	url: string;
	guildExternalId: string;
}

export async function updateItemUseCase({
	id,
	name,
	description,
	guildExternalId,
	url,
}: EditItemProps) {
	const guild = await db
		.select()
		.from(guildTable)
		.where(eq(guildTable.externalId, guildExternalId))
		.get();

	if (!guild) {
		throw new ResourceNotFoundError();
	}

	await db
		.update(itemTable)
		.set({
			name,
			description,
			url,
		})
		.where(and(eq(itemTable.id, id), eq(itemTable.guildId, guild.id)));
}

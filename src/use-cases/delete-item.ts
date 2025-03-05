import { db } from "@/lib/database/drizzle";
import { guildTable, itemTable } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface DeleteItemProps {
	id: number;
	guildExternalId: string;
}

export async function deleteItemUseCase({
	id,
	guildExternalId,
}: DeleteItemProps) {
	const guild = await db
		.select()
		.from(guildTable)
		.where(eq(guildTable.externalId, guildExternalId))
		.get();

	if (!guild) {
		throw new ResourceNotFoundError();
	}

	await db
		.delete(itemTable)
		.where(and(eq(itemTable.id, id), eq(itemTable.guildId, guild.id)));
}

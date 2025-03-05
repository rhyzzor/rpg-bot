import { db } from "@/lib/database/drizzle";
import { guildTable, itemTable } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CreateItemProps {
	guildExternalId: string;
	name: string;
	description: string;
	url: string;
}

export async function createItemUseCase({
	guildExternalId,
	name,
	url,
	description,
}: CreateItemProps) {
	const guild = await db
		.select({ id: guildTable.id })
		.from(guildTable)
		.where(eq(guildTable.externalId, guildExternalId))
		.get();

	if (!guild) {
		throw new ResourceNotFoundError();
	}

	await db.insert(itemTable).values({
		description,
		guildId: guild.id,
		url,
		name,
	});
}

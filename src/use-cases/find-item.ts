import { db } from "@/lib/database/drizzle";
import { itemTable } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export async function findItemUseCase(id: number) {
	const item = await db
		.select()
		.from(itemTable)
		.where(eq(itemTable.id, id))
		.get();

	if (!item) {
		throw new ResourceNotFoundError();
	}

	return item;
}

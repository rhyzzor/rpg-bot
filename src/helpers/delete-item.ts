import type { ItemDTO } from "@/lib/database/schema";
import { deleteItemUseCase } from "@/use-cases/delete-item";
import type { CacheType, ChatInputCommandInteraction } from "discord.js";

export async function deleteItem(
	item: ItemDTO,
	interaction: ChatInputCommandInteraction<CacheType>,
) {
	if (!interaction.guildId) {
		return;
	}

	await deleteItemUseCase({
		id: item.id,
		guildExternalId: interaction.guildId,
	});

	await interaction.editReply({
		content: "Item deletado com sucesso",
		flags: "SuppressEmbeds",
		components: [],
	});
}

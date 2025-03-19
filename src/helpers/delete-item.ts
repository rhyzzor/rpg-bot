import type { ItemDTO } from "@/lib/database/schema";
import { translate } from "@/lib/i18n";
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
		guildId: interaction.guildId,
	});

	await interaction.editReply({
		content: translate("item.delete.success", { lng: interaction.locale }),
		flags: "SuppressEmbeds",
		components: [],
	});
}

import { generateItemModal } from "@/components/item/modal";
import type { ItemDTO } from "@/lib/database/schema";
import { translate } from "@/lib/i18n";
import { updateItemUseCase } from "@/use-cases/update-item";
import type { ButtonInteraction, CacheType } from "discord.js";

export async function showEditModal(
	item: ItemDTO,
	interaction: ButtonInteraction<CacheType>,
) {
	if (!interaction.guildId) return;

	const locale = interaction.locale;

	const customId = "modal#item-edit";

	const modal = generateItemModal({
		...item,
		title: translate("item.edit.title", { lng: locale }),
		customId,
		locale,
	});

	await interaction.showModal(modal);

	const modalInteraction = await interaction.awaitModalSubmit({
		filter: (i) => i.customId === customId && i.user.id === interaction.user.id,
		time: 2000000,
	});

	const guildId = modalInteraction.guildId;

	if (!guildId) {
		await modalInteraction.reply(translate("item.edit.error", { lng: locale }));
		return;
	}

	const getValue = (field: string) =>
		modalInteraction.fields.getTextInputValue(field);

	const itemName = getValue("itemNameInput");
	const descriptionName = getValue("itemDescriptionInput");
	const imageUrl = getValue("itemUrlInput");

	const id = item.id;

	await updateItemUseCase({
		id,
		name: itemName,
		description: descriptionName,
		guildId,
		url: imageUrl,
	});

	await modalInteraction.reply({
		content: translate("item.edit.success", { lng: locale }),
		flags: "Ephemeral",
	});

	return;
}

import { generateItemModal } from "@/components/item/modal";
import { translate } from "@/lib/i18n";
import { createItemUseCase } from "@/use-cases/create-item";
import type { CommandOptions, SlashCommandProps } from "commandkit";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("create-item")
	.setDescription("Create an item [ADMIN]")
	.setNameLocalizations({
		"pt-BR": "criar-item",
	})
	.setDescriptionLocalizations({
		"pt-BR": "Cria um item [ADMIN]",
	});

export async function run({ interaction }: SlashCommandProps) {
	const customId = "modal#item-create";

	const lng = interaction.locale;

	const modal = generateItemModal({
		customId,
		title: translate("item.create.title", { lng }),
		locale: lng,
	});

	await interaction.showModal(modal);

	const modalInteraction = await interaction.awaitModalSubmit({
		filter: (i) => i.customId === customId && i.user.id === interaction.user.id,
		time: 60_000,
	});

	if (!modalInteraction.guildId) {
		return await modalInteraction.reply(
			translate("item.create.error", { lng }),
		);
	}

	const getValue = (field: string) =>
		modalInteraction.fields.getTextInputValue(field);

	const itemName = getValue("itemNameInput");
	const descriptionName = getValue("itemDescriptionInput");
	const imageUrl = getValue("itemUrlInput");

	await createItemUseCase({
		description: descriptionName,
		guildId: modalInteraction.guildId,
		name: itemName,
		url: imageUrl,
	});

	return await modalInteraction.reply({
		content: translate("item.create.success", { lng }),
		flags: "Ephemeral",
	});
}

export const options: CommandOptions = {
	devOnly: true,
	userPermissions: ["Administrator"],
};

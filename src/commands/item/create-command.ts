import { generateItemModal } from "@/components/item/modal-builder";
import { createItemUseCase } from "@/use-cases/create-item";
import type { CommandOptions, SlashCommandProps } from "commandkit";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("criar-item")
	.setDescription("Cria um item")
	.setNameLocalizations({
		"pt-BR": "criar-item",
		"en-US": "create-item",
	})
	.setDescriptionLocalizations({
		"pt-BR": "Cria um item",
		"en-US": "Create an item",
	});

export async function run({ interaction }: SlashCommandProps) {
	const customId = interaction.id;

	const modal = generateItemModal({ customId, title: "Criar um novo item" });

	await interaction.showModal(modal);

	const modalInteraction = await interaction.awaitModalSubmit({
		filter: (i) => i.customId === customId && i.user.id === interaction.user.id,
		time: 60_000,
	});

	if (!modalInteraction.guildId) {
		return await modalInteraction.reply("Não foi possível criar o item");
	}

	const getValue = (field: string) =>
		modalInteraction.fields.getTextInputValue(field);

	const itemName = getValue("itemNameInput");
	const descriptionName = getValue("itemDescriptionInput");
	const imageUrl = getValue("itemUrlInput");

	await createItemUseCase({
		description: descriptionName,
		guildExternalId: modalInteraction.guildId,
		name: itemName,
		url: imageUrl,
	});

	return await modalInteraction.reply({
		content: `Item **${itemName}** criado com sucesso!`,
		flags: "Ephemeral",
	});
}

export const options: CommandOptions = {
	devOnly: true,
};

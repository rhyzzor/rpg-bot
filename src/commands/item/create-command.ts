import { createItemUseCase } from "@/use-cases/create-item";
import {
	ActionRowBuilder,
	type ModalActionRowComponentBuilder,
	ModalBuilder,
	TextInputBuilder,
} from "@discordjs/builders";
import {
	type CacheType,
	type CommandInteraction,
	type ModalSubmitInteraction,
	SlashCommandBuilder,
	TextInputStyle,
} from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("criar-item")
	.setDescription("Cria um novo item");

export async function execute(interaction: CommandInteraction) {
	const modal = new ModalBuilder()
		.setCustomId("create-item-modal")
		.setTitle("Create a new item");

	const itemNameInput = new TextInputBuilder()
		.setCustomId("itemNameInput")
		.setMaxLength(255)
		.setLabel("Nome")
		.setPlaceholder("Qual o nome do seu item?")
		.setStyle(TextInputStyle.Short);

	const itemDescriptionInput = new TextInputBuilder()
		.setCustomId("itemDescriptionInput")
		.setLabel("Descrição")
		.setPlaceholder("Qual a descrição do seu item?")
		.setStyle(TextInputStyle.Paragraph);

	const firstActionRow =
		new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
			itemNameInput,
		);
	const secondActionRow =
		new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
			itemDescriptionInput,
		);

	modal.addComponents(firstActionRow, secondActionRow);

	await interaction.showModal(modal);

	const filter = (interaction: ModalSubmitInteraction<CacheType>) =>
		interaction.customId === "create-item-modal";

	interaction
		.awaitModalSubmit({
			filter,
			time: 30000,
		})
		.then(async (modalInteraction) => {
			if (!modalInteraction.guildId) {
				return await modalInteraction.reply("Não foi possível criar o item");
			}

			const getValue = (field: string) =>
				modalInteraction.fields.getTextInputValue(field);

			const itemName = getValue("itemNameInput");
			const descriptionName = getValue("itemDescriptionInput");

			await createItemUseCase({
				description: descriptionName,
				guildExternalId: modalInteraction.guildId,
				name: itemName,
			});

			return await modalInteraction.reply(
				`Item ${itemName} criado com sucesso!`,
			);
		});
}

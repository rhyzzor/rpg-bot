import { createItemUseCase } from "@/use-cases/create-item";
import { generateItemModal } from "@/utils/modal-builder";
import {} from "@discordjs/builders";
import {
	type CacheType,
	type CommandInteraction,
	type ModalSubmitInteraction,
	SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("criar-item")
	.setDescription("Cria um novo item");

export async function execute(interaction: CommandInteraction) {
	const customId = `create-item-modal#${interaction.id}`;

	const modal = generateItemModal({ customId, title: "Criar um novo item" });

	await interaction.showModal(modal);

	const filter = (interaction: ModalSubmitInteraction<CacheType>) =>
		interaction.customId === customId;

	interaction
		.awaitModalSubmit({
			filter,
			time: 60000,
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

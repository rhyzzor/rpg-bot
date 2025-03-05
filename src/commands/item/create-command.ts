import { createItemUseCase } from "@/use-cases/create-item";
import { generateItemModal } from "@/utils/modal-builder";
import {} from "@discordjs/builders";
import { type CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("criar-item")
	.setDescription("Cria um novo item");

export async function execute(interaction: CommandInteraction) {
	try {
		const customId = `create-item-modal.${interaction.id}`;

		const modal = generateItemModal({ customId, title: "Criar um novo item" });

		await interaction.showModal(modal);

		interaction
			.awaitModalSubmit({
				filter: (i) => i.customId === customId,
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
			});
	} catch (error) {
		console.error(error);
	}
}

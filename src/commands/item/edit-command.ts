import { editItemUseCase } from "@/use-cases/edit-item";
import { findItemUseCase } from "@/use-cases/find-item";
import { listItemsUseCase } from "@/use-cases/list-items";
import { generateItemModal } from "@/utils/modal-builder";
import { createItemSelectionMenu } from "@/utils/selection-menu";
import {
	type CommandInteraction,
	ComponentType,
	SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("editar-item")
	.setDescription("Edita um item");

export async function execute(interaction: CommandInteraction) {
	try {
		if (!interaction.guild || !interaction.guildId) {
			return interaction.reply({
				content: "Você precisa estar em um servidor para executar esse comando",
				ephemeral: true,
			});
		}

		const items = await listItemsUseCase({
			guildExternalId: interaction.guildId,
		});

		const selectionMenuRow = createItemSelectionMenu({
			items,
			customId: "edit-item-select",
		});

		const reply = await interaction.reply({
			components: [selectionMenuRow],
			flags: "Ephemeral",
		});

		const collector = reply.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			time: 30000,
			filter: (i) =>
				i.user.id === interaction.user.id && i.customId === "edit-item-select",
		});

		collector.on("collect", async (collectorInteraction) => {
			if (!collectorInteraction.values.length) {
				interaction.reply("Nenhum item selecionado");
				return;
			}

			const selectedItemId = Number(collectorInteraction.values[0]);

			const item = await findItemUseCase(selectedItemId);
			const customId = `edit-item-modal.${collectorInteraction.id}#${item.id}`;

			const editModalItem = generateItemModal({
				...item,
				title: "Editar item",
				customId,
			});

			await collectorInteraction.showModal(editModalItem);

			collectorInteraction
				.awaitModalSubmit({
					filter: (i) => i.customId === customId,
					time: 60000,
				})
				.then(async (modalInteraction) => {
					const guildId = interaction.guildId;

					if (!guildId) {
						return interaction.reply({
							content: "Ocorreu um erro ao editar o item",
							ephemeral: true,
						});
					}

					const getValue = (field: string) =>
						modalInteraction.fields.getTextInputValue(field);

					const itemName = getValue("itemNameInput");
					const descriptionName = getValue("itemDescriptionInput");
					const imageUrl = getValue("itemUrlInput");

					const id = Number(modalInteraction.customId.split("#")[1]);

					if (!id) {
						return await modalInteraction.reply({
							content: "Ocorreu um erro ao editar o item",
							flags: "Ephemeral",
						});
					}

					await editItemUseCase({
						id,
						name: itemName,
						description: descriptionName,
						url: imageUrl,
						guildExternalId: guildId,
					});

					return await modalInteraction.reply({
						content: `Item **${itemName}** editado com sucesso`,
						flags: "Ephemeral",
					});
				});
		});
	} catch (error) {
		console.error(error);
	}
}

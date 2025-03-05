import { deleteItemUseCase } from "@/use-cases/delete-item";
import { listItemsUseCase } from "@/use-cases/list-items";
import { createItemSelectionMenu } from "@/utils/selection-menu";
import {
	type CommandInteraction,
	ComponentType,
	SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("deletar-item")
	.setDescription("Deleta o item selecionado");

export async function execute(interaction: CommandInteraction) {
	try {
		if (!interaction.guild || !interaction.guildId) {
			return await interaction.reply({
				content: "Você precisa estar em um servidor para executar esse comando",
				ephemeral: true,
			});
		}

		const guildId = interaction.guildId;

		const items = await listItemsUseCase({
			guildExternalId: guildId,
		});

		const selectionMenu = createItemSelectionMenu({
			customId: "delete-item-select",
			items,
		});

		const reply = await interaction.reply({
			components: [selectionMenu],
			flags: "Ephemeral",
		});

		const collector = reply.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			time: 30000,
			filter: (i) =>
				i.user.id === interaction.user.id &&
				i.customId === "delete-item-select",
		});

		collector.on("collect", async (collectorInteraction) => {
			if (!collectorInteraction.values.length) {
				interaction.reply({
					content: "Nenhum item selecionado",
					flags: "Ephemeral",
				});
				return;
			}

			if (!collectorInteraction.guildId) {
				collectorInteraction.reply({
					content: "Não foi possível deletar o item",
					flags: "Ephemeral",
				});
				return;
			}

			const selectedItemId = Number(collectorInteraction.values[0]);

			await deleteItemUseCase({
				id: selectedItemId,
				guildExternalId: collectorInteraction.guildId,
			});

			return await collectorInteraction.reply({
				content: "Item deletado com sucesso",
				flags: "Ephemeral",
			});
		});
	} catch (error) {
		console.error(error);
	}
}

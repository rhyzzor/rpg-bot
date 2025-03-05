import { findItemUseCase } from "@/use-cases/find-item";
import { listItemsUseCase } from "@/use-cases/list-items";
import { createItemSelectionMenu } from "@/utils/selection-menu";
import {
	type CommandInteraction,
	ComponentType,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("listar-item")
	.setDescription("Lista o item selecionado");

export async function execute(interaction: CommandInteraction) {
	try {
		if (!interaction.guildId || !interaction.guild) {
			return interaction.reply({
				content: "Você precisa estar em um servidor para executar esse comando",
				flags: "Ephemeral",
			});
		}

		const items = await listItemsUseCase({
			guildExternalId: interaction.guildId,
		});

		const selectionMenu = createItemSelectionMenu({
			items,
			customId: "find-item-select",
		});

		const reply = await interaction.reply({
			components: [selectionMenu],
			flags: "Ephemeral",
		});

		const collector = reply.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			time: 30000,
			filter: (i) =>
				i.user.id === interaction.user.id && i.customId === "find-item-select",
		});

		collector.on("collect", async (collectorInteraction) => {
			if (!collectorInteraction.values.length) {
				interaction.reply("Nenhum item selecionado");
				return;
			}

			const selectedItemId = Number(collectorInteraction.values[0]);
			const item = await findItemUseCase(selectedItemId);

			const embed = new EmbedBuilder()
				.setColor("#ff0000")
				.setTitle(item.name)
				.setDescription(item.description)
				.setThumbnail(item.url);

			await collectorInteraction.reply({
				embeds: [embed],
			});
		});
	} catch (error) {
		console.error(error);
	}
}

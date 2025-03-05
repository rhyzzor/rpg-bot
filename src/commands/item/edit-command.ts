import { findItemUseCase } from "@/use-cases/find-item";
import { listItemsUseCase } from "@/use-cases/list-items";
import { generateItemModal } from "@/utils/modal-builder";
import {
	ActionRowBuilder,
	type CommandInteraction,
	ComponentType,
	ModalBuilder,
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("editar-item")
	.setDescription("Edita um item");

export async function execute(interaction: CommandInteraction) {
	const modal = new ModalBuilder().setCustomId("edit-item-modal");

	if (!interaction.guild || !interaction.guildId) {
		return interaction.reply({
			content: "Você precisa estar em um servidor para executar esse comando",
			ephemeral: true,
		});
	}

	const items = await listItemsUseCase({
		guildExternalId: interaction.guildId,
	});

	const selectionMenu = new StringSelectMenuBuilder()
		.setCustomId("edit-item-select")
		.setMaxValues(1)
		.setMinValues(1)
		.setPlaceholder("Selecione um item");

	const options = items.map((item) => {
		const option = new StringSelectMenuOptionBuilder()
			.setLabel(item.name)
			.setDescription(item.description.slice(0, 50).concat("..."))
			.setValue(item.id.toString());

		return option;
	});

	selectionMenu.addOptions(options);

	const selectionMenuRow =
		new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
			selectionMenu,
		);

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
		const customId = `edit-item-modal#${collectorInteraction.id}`;

		const editModalItem = generateItemModal({
			...item,
			title: "Editar item",
			customId,
		});

		await collectorInteraction.showModal(editModalItem);

		collectorInteraction.awaitModalSubmit({
			filter: (i) => i.customId === customId,
			time: 60000,
		});
	});
}

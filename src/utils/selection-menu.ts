import {
	ActionRowBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from "discord.js";

type ItemDTO = {
	id: number;
	name: string;
	description: string;
};

interface ItemSelectionMenuProps {
	items: ItemDTO[];
	customId: string;
}

export function createItemSelectionMenu({
	items,
	customId,
}: ItemSelectionMenuProps) {
	const selectionMenu = new StringSelectMenuBuilder()
		.setCustomId(customId)
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

	return selectionMenuRow;
}

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
		const description =
			item.description.length > 90
				? item.description.slice(0, 80).concat("...")
				: item.description;

		const option = new StringSelectMenuOptionBuilder()
			.setLabel(item.name)
			.setDescription(description)
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

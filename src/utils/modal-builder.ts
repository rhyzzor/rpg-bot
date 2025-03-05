import {
	ActionRowBuilder,
	type ModalActionRowComponentBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";

interface ModalProps {
	name?: string;
	description?: string;
	url?: string;
	customId: string;
	title: string;
}

export function generateItemModal(options: ModalProps) {
	const modal = new ModalBuilder()
		.setCustomId(options.customId)
		.setTitle(options.title);

	const itemNameInput = new TextInputBuilder()
		.setCustomId("itemNameInput")
		.setMaxLength(100)
		.setLabel("Nome")
		.setPlaceholder("Qual o nome do seu item?")
		.setValue(options?.name ?? "")
		.setStyle(TextInputStyle.Short);

	const itemDescriptionInput = new TextInputBuilder()
		.setCustomId("itemDescriptionInput")
		.setLabel("Descrição")
		.setMaxLength(500)
		.setValue(options?.description ?? "")
		.setPlaceholder("Qual a descrição do seu item?")
		.setStyle(TextInputStyle.Paragraph);

	const itemUrlInput = new TextInputBuilder()
		.setCustomId("itemUrlInput")
		.setLabel("URL")
		.setPlaceholder("Coloque a URL da imagem do seu item")
		.setValue(options?.url ?? "")
		.setStyle(TextInputStyle.Short);

	const firstActionRow =
		new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
			itemNameInput,
		);
	const secondActionRow =
		new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
			itemDescriptionInput,
		);

	const thirdActionRow =
		new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
			itemUrlInput,
		);

	modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

	return modal;
}

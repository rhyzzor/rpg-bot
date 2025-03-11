import {
	ActionRowBuilder,
	type ModalActionRowComponentBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";

interface ModalProps {
	name?: string;
	url?: string;
	customId: string;
	title: string;
}

export function generatePlayerModal(options: ModalProps) {
	const modal = new ModalBuilder()
		.setCustomId(options.customId)
		.setTitle(options.title);

	const nameInput = new TextInputBuilder()
		.setCustomId("playerNameInput")
		.setMaxLength(100)
		.setLabel("Nome")
		.setRequired(true)
		.setPlaceholder("Qual o nome do personagem?")
		.setValue(options?.name ?? "")
		.setStyle(TextInputStyle.Short);

	const urlInput = new TextInputBuilder()
		.setCustomId("playerUrlInput")
		.setLabel("URL")
		.setPlaceholder("Coloque a URL da imagem do personagem")
		.setRequired(true)
		.setValue(options?.url ?? "")
		.setStyle(TextInputStyle.Short);

	const backgroundInput = new TextInputBuilder()
		.setCustomId("playerBackgroundInput")
		.setMaxLength(1000)
		.setLabel("Background")
		.setPlaceholder("Descreva o background do personagem")
		.setStyle(TextInputStyle.Paragraph)
		.setRequired(true);

	const extraInput = new TextInputBuilder()
		.setCustomId("playerExtraInput")
		.setMaxLength(1000)
		.setLabel("Detalhes Extra")
		.setPlaceholder("Descreva os detalhes extras do personagem")
		.setRequired(false)
		.setStyle(TextInputStyle.Paragraph);

	const firstActionRow =
		new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
			nameInput,
		);
	const secondActionRow =
		new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
			urlInput,
		);

	const thirdActionRow =
		new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
			backgroundInput,
		);

	const fourthActionRow =
		new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
			extraInput,
		);

	modal.addComponents(
		firstActionRow,
		secondActionRow,
		thirdActionRow,
		fourthActionRow,
	);

	return modal;
}

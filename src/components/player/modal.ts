import { translate } from "@/lib/i18n";
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
	background?: string;
	extraDetails?: string | null;
	customId: string;
	title: string;
	locale: string;
}

export function generatePlayerModal(options: ModalProps) {
	const modal = new ModalBuilder()
		.setCustomId(options.customId)
		.setTitle(options.title);

	const nameInput = new TextInputBuilder()
		.setCustomId("playerNameInput")
		.setMaxLength(100)
		.setLabel(translate("player.input.name.label", { lng: options.locale }))
		.setRequired(true)
		.setPlaceholder(
			translate("player.input.name.placeholder", { lng: options.locale }),
		)
		.setValue(options?.name ?? "")
		.setStyle(TextInputStyle.Short);

	const urlInput = new TextInputBuilder()
		.setCustomId("playerUrlInput")
		.setLabel("URL")
		.setPlaceholder(
			translate("player.input.url.placeholder", { lng: options.locale }),
		)
		.setRequired(true)
		.setValue(options?.url ?? "")
		.setStyle(TextInputStyle.Short);

	const backgroundInput = new TextInputBuilder()
		.setCustomId("playerBackgroundInput")
		.setMaxLength(1000)
		.setLabel(
			translate("player.input.background.label", { lng: options.locale }),
		)
		.setPlaceholder(
			translate("player.input.background.placeholder", { lng: options.locale }),
		)
		.setValue(options?.background ?? "")
		.setStyle(TextInputStyle.Paragraph)
		.setRequired(true);

	const extraInput = new TextInputBuilder()
		.setCustomId("playerExtraInput")
		.setMaxLength(1000)
		.setLabel(
			translate("player.input.extraDetails.label", { lng: options.locale }),
		)
		.setValue(options?.extraDetails ?? "")
		.setPlaceholder(
			translate("player.input.extraDetails.placeholder", {
				lng: options.locale,
			}),
		)
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

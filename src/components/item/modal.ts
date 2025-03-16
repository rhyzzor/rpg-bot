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
	description?: string;
	url?: string;
	customId: string;
	title: string;
	locale: string;
}

export function generateItemModal(options: ModalProps) {
	const modal = new ModalBuilder()
		.setCustomId(options.customId)
		.setTitle(options.title);

	const itemNameInput = new TextInputBuilder()
		.setCustomId("itemNameInput")
		.setMaxLength(100)
		.setLabel(translate("item.input.name.label", { lng: options.locale }))
		.setRequired(true)
		.setPlaceholder(
			translate("item.input.name.placeholder", { lng: options.locale }),
		)
		.setValue(options?.name ?? "")
		.setStyle(TextInputStyle.Short);

	const itemDescriptionInput = new TextInputBuilder()
		.setCustomId("itemDescriptionInput")
		.setLabel(
			translate("item.input.description.label", { lng: options.locale }),
		)
		.setMaxLength(500)
		.setRequired(true)
		.setValue(options?.description ?? "")
		.setPlaceholder(
			translate("item.input.description.placeholder", { lng: options.locale }),
		)
		.setStyle(TextInputStyle.Paragraph);

	const itemUrlInput = new TextInputBuilder()
		.setCustomId("itemUrlInput")
		.setLabel("URL")
		.setPlaceholder(
			translate("item.input.url.placeholder", { lng: options.locale }),
		)
		.setRequired(true)
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

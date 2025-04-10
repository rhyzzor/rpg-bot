import { deleteItem } from "@/helpers/delete-item";
import { showEditModal } from "@/helpers/edit-item-modal";
import { translate } from "@/lib/i18n";
import { findItemUseCase } from "@/use-cases/find-item";
import { listItemsUseCase } from "@/use-cases/list-items";
import type {
	AutocompleteProps,
	CommandOptions,
	SlashCommandProps,
} from "commandkit";
import {
	ActionRowBuilder,
	ButtonBuilder,
	type ButtonInteraction,
	ButtonStyle,
	type CacheType,
	EmbedBuilder,
	type PermissionsBitField,
	SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("item")
	.setDescription("Commands related to item")
	.setDescriptionLocalizations({
		"pt-BR": "Comandos relacionados ao item",
	})
	.addIntegerOption((option) =>
		option
			.setName("name")
			.setDescription("Item name")
			.setNameLocalizations({
				"pt-BR": "nome",
			})
			.setDescriptionLocalizations({
				"pt-BR": "Nome do Item",
			})
			.setRequired(true)
			.setAutocomplete(true),
	);

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.guildId) {
		return;
	}

	const selectedItemId = interaction.options.getInteger("name", true);
	const lng = interaction.locale;

	const item = await findItemUseCase(selectedItemId);

	const embed = new EmbedBuilder()
		.setTitle(item.name)
		.setThumbnail(item.url)
		.setFields({
			name: translate("embed.label.description", { lng }),
			value: item.description,
		});

	const permissions = interaction.member?.permissions as PermissionsBitField;
	const isAdmin = permissions.has("Administrator");

	const options = [
		{
			name: translate("button.label.edit", { lng }),
			emoji: "📝",
			style: ButtonStyle.Secondary,
			execute: async (interaction: ButtonInteraction<CacheType>) => {
				await showEditModal(item, interaction);
			},
		},
		{
			name: translate("button.label.delete", { lng }),
			emoji: "🗑️",
			style: ButtonStyle.Danger,
			execute: async (_: unknown) => {
				await deleteItem(item, interaction);
			},
		},
	];

	let row = undefined;

	if (isAdmin) {
		const buttons = options.map((option) => {
			return new ButtonBuilder()
				.setEmoji(option.emoji)
				.setLabel(option.name)
				.setStyle(option.style)
				.setCustomId(option.name);
		});

		row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
	}

	const reply = await interaction.reply({
		embeds: [embed],
		components: row ? [row] : undefined,
		flags: "Ephemeral",
	});

	if (!isAdmin) return;

	const targetOptionInteraction = (await reply
		.awaitMessageComponent({
			filter: (i) => i.user.id === interaction.user.id,
			time: 600_000,
		})
		.catch(async (_error) => {
			await reply.edit({ embeds: [embed], components: [] });
			return;
		})) as ButtonInteraction<CacheType>;

	if (!targetOptionInteraction) return;

	const targetOption = options.find(
		(option) => option.name === targetOptionInteraction.customId,
	);

	if (!targetOption) return;

	await targetOption.execute(targetOptionInteraction);
}

export async function autocomplete({ interaction }: AutocompleteProps) {
	if (!interaction.guildId) {
		return;
	}

	const focusedOption = interaction.options.getFocused(true).value.trim();

	const items = await listItemsUseCase({
		guildId: interaction.guildId,
	});

	const result = items
		.filter((item) =>
			item.name.toLowerCase().startsWith(focusedOption.toLowerCase()),
		)
		.map((item) => {
			return {
				name: item.name,
				value: item.id,
			};
		});

	await interaction.respond(result);
}

export const options: CommandOptions = {
	devOnly: true,
};

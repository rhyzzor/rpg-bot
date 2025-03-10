import { deleteItem } from "@/helpers/delete-item";
import { showEditModal } from "@/helpers/edit-item-modal";
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
	SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("item")
	.setDescription("Comandos relacionados ao item")
	.setNameLocalizations({
		"pt-BR": "item",
		"en-US": "item",
	})
	.setDescriptionLocalizations({
		"pt-BR": "Comandos relacionados ao item",
		"en-US": "Commands related to item",
	})
	.addStringOption((option) =>
		option
			.setName("name")
			.setDescription("Digite o nome do item")
			.setRequired(true)
			.setAutocomplete(true),
	);

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.guildId) {
		return;
	}

	const selectedItemId = Number(interaction.options.getString("name", true));

	const item = await findItemUseCase(selectedItemId);

	const options = [
		{
			name: "Editar",
			emoji: "📝",
			style: ButtonStyle.Secondary,
			execute: async (interaction: ButtonInteraction<CacheType>) => {
				await showEditModal(item, interaction);
			},
		},
		{
			name: "Deletar",
			emoji: "🗑️",
			style: ButtonStyle.Danger,
			execute: async (_: unknown) => {
				await deleteItem(item, interaction);
			},
		},
	];

	const buttons = options.map((option) => {
		return new ButtonBuilder()
			.setEmoji(option.emoji)
			.setLabel(option.name)
			.setStyle(option.style)
			.setCustomId(option.name);
	});

	const embed = new EmbedBuilder()
		.setTitle(item.name)
		.setThumbnail(item.url)
		.setFields({
			name: "Descrição",
			value: item.description,
		});

	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

	const reply = await interaction.reply({
		embeds: [embed],
		components: [row],
		flags: "Ephemeral",
	});

	const targetOptionInteraction = (await reply
		.awaitMessageComponent({
			filter: (i) => i.user.id === interaction.user.id,
			time: 30_000,
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

	const focusedOption = interaction.options.getFocused(true).value;

	const items = await listItemsUseCase({
		guildExternalId: interaction.guildId,
	});

	const result = items
		.filter((item) =>
			item.name.toLowerCase().startsWith(focusedOption.toLowerCase()),
		)
		.map((item) => {
			return {
				name: item.name,
				value: item.id.toString(),
			};
		});

	await interaction.respond(result);
}

export const options: CommandOptions = {
	devOnly: true,
};

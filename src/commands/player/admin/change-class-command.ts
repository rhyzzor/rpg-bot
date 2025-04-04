import classData from "@/assets/class.json";
import { sendPrivateMessage } from "@/helpers/send-private-message";
import { translate } from "@/lib/i18n";
import { changePlayerClassUseCase } from "@/use-cases/change-player-class";
import { listPlayersUseCase } from "@/use-cases/list-players";
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
	SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("change-class")
	.setDescription("Change the class of a sheet [ADMIN]")
	.setNameLocalizations({
		"pt-BR": "mudar-classe",
	})
	.setDescriptionLocalizations({
		"pt-BR": "Muda a classe de uma ficha [ADMIN]",
	})
	.addIntegerOption((option) =>
		option
			.setName("sheet")
			.setNameLocalizations({ "pt-BR": "ficha" })
			.setDescription("Player/Extra Character Sheet")
			.setDescriptionLocalizations({
				"pt-BR": "Ficha do Jogador/Personagem Extra",
			})
			.setAutocomplete(true)
			.setRequired(true),
	)
	.addIntegerOption((option) =>
		option
			.setName("class")
			.setNameLocalizations({ "pt-BR": "classe" })
			.setDescription("Character Class")
			.setDescriptionLocalizations({
				"pt-BR": "Classe do Personagem",
			})
			.addChoices(
				classData.map((c) => ({
					name: c.name,
					value: c.id,
					name_localizations: { "pt-BR": c.name_ptBR, "en-US": c.name_enUS },
				})),
			)
			.setRequired(true),
	);

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.guildId) {
		return;
	}

	const guildId = interaction.guildId;

	const playerId = interaction.options.getInteger("sheet", true);
	const classId = interaction.options.getInteger("class", true);

	const options = [
		{
			label: translate("button.label.confirm", { lng: interaction.locale }),
			emoji: "✅",
			style: ButtonStyle.Success,
			execute: async (interaction: ButtonInteraction<CacheType>) => {
				const player = await changePlayerClassUseCase({
					guildId,
					playerId,
					classId,
				});

				if (player.externalId) {
					const member = await interaction.guild?.members.fetch({
						user: player.externalId,
					});

					if (member) {
						await sendPrivateMessage(member, interaction, "invite.sheet.class");
					}
				}

				await interaction.reply({
					content: translate("player.class.change", {
						lng: interaction.locale,
					}),
					flags: "Ephemeral",
				});
			},
		},
		{
			label: translate("button.label.cancel", { lng: interaction.locale }),
			emoji: "❌",
			style: ButtonStyle.Danger,
			execute: async (interaction: ButtonInteraction<CacheType>) => {
				await interaction.reply({
					content: translate("player.class.change-cancel", {
						lng: interaction.locale,
					}),
					flags: "Ephemeral",
				});
			},
		},
	];

	const buttons = options.map((option) => {
		return new ButtonBuilder()
			.setEmoji(option.emoji)
			.setLabel(option.label)
			.setStyle(option.style)
			.setCustomId(option.label);
	});

	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

	const reply = await interaction.reply({
		content: translate("player.class.change-confirmation", {
			lng: interaction.locale,
		}),
		components: [row],
		flags: "Ephemeral",
	});

	const targetOptionInteraction = (await reply
		.awaitMessageComponent({
			filter: (i) => i.user.id === interaction.user.id,
			time: 600_000,
		})
		.catch(async (_error) => {
			await reply.edit({ components: [] });
			return;
		})) as ButtonInteraction<CacheType>;

	const targetOption = options.find(
		(option) => option.label === targetOptionInteraction.customId,
	);

	if (!targetOption) return;

	await targetOption.execute(targetOptionInteraction);
}

export async function autocomplete({ interaction }: AutocompleteProps) {
	if (!interaction.guildId) {
		return;
	}

	const guildId = interaction.guildId;

	const focusedOption = interaction.options.getFocused(true).value.trim();

	const sheets = await listPlayersUseCase({
		guildId,
	});

	const result = sheets
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
	userPermissions: ["Administrator"],
};

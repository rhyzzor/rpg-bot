import { calculateHpAndMana } from "@/helpers/calculate-hp-and-mana";
import { translate } from "@/lib/i18n";
import { findPlayerUseCase } from "@/use-cases/find-player";
import { listPlayersUseCase } from "@/use-cases/list-players";
import { EmbedBuilder } from "@discordjs/builders";
import type {
	AutocompleteProps,
	CommandOptions,
	SlashCommandProps,
} from "commandkit";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("sheet")
	.setNameLocalizations({
		"pt-BR": "ficha",
	})
	.setDescription("Player Sheet")
	.setDescriptionLocalizations({
		"pt-BR": "Ficha do Jogador",
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
	.addStringOption((option) =>
		option
			.setName("show")
			.setNameLocalizations({ "pt-BR": "mostrar" })
			.setDescription("Show the sheet in the chat")
			.addChoices(
				{
					name: "Yes",
					value: "true",
					name_localizations: { "pt-BR": "Sim" },
				},
				{
					name: "No",
					value: "false",
					name_localizations: { "pt-BR": "Não" },
				},
			)
			.setDescriptionLocalizations({
				"pt-BR": "Mostra a ficha para todos no chat",
			})
			.setRequired(true),
	);

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.guildId) return;

	const show = interaction.options.getString("show", true) === "true";
	const playerId = interaction.options.getInteger("sheet", true);

	const player = await findPlayerUseCase({
		id: playerId,
		guildId: interaction.guildId,
	});

	if (!player) {
		return await interaction.reply({
			content: translate("player.errors.not-found", {
				lng: interaction.locale,
			}),
			flags: "Ephemeral",
		});
	}

	const { hp, mana } = calculateHpAndMana(player);

	const embed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle(player.name)
		.setImage(player.url)
		.setDescription(player.background)
		.addFields(
			{
				name: "**EXTRA**",
				value: player.extraDetails || "-",
			},
			{
				name: translate("inventory.label", {
					lng: interaction.locale,
				}).toUpperCase(),
				value: player.inventory
					.map((item) => `${item.itemName} - **x${item.quantity}**`)
					.join("\n"),
			},
			{
				name: translate("attribute.label", {
					lng: interaction.locale,
				}).toUpperCase(),
				value: [
					`Level: **${player.level}**`,
					`HP: **${player.hp}/${hp}**`,
					`Mana: **${player.mana}/${mana}**`,
				]
					.concat(
						player.stats.map(
							(stat) =>
								`${translate(`attribute.${stat.label.toLowerCase()}`, { lng: interaction.locale })}: **${stat.value}**`,
						),
					)
					.join("\n"),
			},
			{
				name: translate("player.points.label", {
					lng: interaction.locale,
				}).toUpperCase(),
				value: `${player.points}`,
			},
		);

	await interaction.reply({
		embeds: [embed],
		flags: show ? undefined : "Ephemeral",
	});
}

export async function autocomplete({ interaction }: AutocompleteProps) {
	if (!interaction.guildId) return;

	const focusedOption = interaction.options.getFocused(true);
	const guildId = interaction.guildId;

	const data = await listPlayersUseCase({
		guildId,
	});

	const result = data
		.filter((item) =>
			item.name.toLowerCase().includes(focusedOption.value.toLowerCase()),
		)
		.map((item) => ({
			name: item.name,
			value: item.id,
		}));

	await interaction.respond(result);
}

export const options: CommandOptions = {
	devOnly: true,
};

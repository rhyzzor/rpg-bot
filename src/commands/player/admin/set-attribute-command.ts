import { translate } from "@/lib/i18n";
import { findPlayerUseCase } from "@/use-cases/find-player";
import { updatePlayerStatsUseCase } from "@/use-cases/update-player-stats";
import type { CommandOptions, SlashCommandProps } from "commandkit";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("set-attribute")
	.setNameLocalizations({
		"pt-BR": "setar-atributo",
	})
	.setDescription("Update an attribute of any sheet [ADMIN]")
	.setDescriptionLocalizations({
		"pt-BR": "Atualiza um atributo de qualquer ficha [ADMIN]",
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
			.setName("attribute")
			.setNameLocalizations({ "pt-BR": "atributo" })
			.setDescription("Select an attribute to set points")
			.setDescriptionLocalizations({
				"pt-BR": "Selecione um atributo para setar os pontos",
			})
			.addChoices([
				{
					name: "Strength",
					value: "strength",
					name_localizations: { "pt-BR": "Força" },
				},
				{
					name: "Dexterity",
					value: "dexterity",
					name_localizations: { "pt-BR": "Destreza" },
				},
				{
					name: "Constitution",
					value: "constitution",
					name_localizations: { "pt-BR": "Constituição" },
				},
				{
					name: "Intelligence",
					value: "intelligence",
					name_localizations: { "pt-BR": "Inteligência" },
				},
				{
					name: "Wisdom",
					value: "wisdom",
					name_localizations: { "pt-BR": "Sabedoria" },
				},
				{
					name: "Charisma",
					value: "charisma",
					name_localizations: { "pt-BR": "Carisma" },
				},
			])
			.setRequired(true),
	)
	.addIntegerOption((option) =>
		option
			.setName("points")
			.setNameLocalizations({ "pt-BR": "pontos" })
			.setDescription("Points to be set")
			.setDescriptionLocalizations({ "pt-BR": "Pontos a serem setados" })
			.setRequired(true),
	);

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.guildId) return;

	const guildId = interaction.guildId;

	const playerId = interaction.options.getInteger("sheet", true);
	const attribute = interaction.options
		.getString("attribute", true)
		.toLowerCase();
	const points = interaction.options.getInteger("points", true);

	const sheet = await findPlayerUseCase({ id: playerId, guildId });

	if (!sheet) {
		return await interaction.reply({
			content: translate("player.errors.not-found", {
				lng: interaction.locale,
			}),
			flags: "Ephemeral",
		});
	}

	const newStats = sheet.stats.map((stat) => {
		if (stat.label.toLowerCase() === attribute) {
			return {
				...stat,
				value: points,
			};
		}

		return stat;
	});

	let hp = undefined;
	let mana = undefined;

	if (attribute === "constitution") {
		hp = 30 + (sheet.level - 1) * 5 + points * 3;
	} else if (attribute === "intelligence") {
		mana = 40 + (sheet.level - 1) * 5 + points * 3;
	}

	await updatePlayerStatsUseCase({
		guildId,
		playerId,
		stats: newStats,
		hp,
		mana,
	});

	return await interaction.reply({
		content: translate("player.points.set", {
			lng: interaction.locale,
		}),
		flags: "Ephemeral",
	});
}

export const options: CommandOptions = {
	devOnly: true,
	userPermissions: ["Administrator"],
};

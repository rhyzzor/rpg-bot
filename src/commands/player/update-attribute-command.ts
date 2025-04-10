import { translate } from "@/lib/i18n";
import { findPlayerUseCase } from "@/use-cases/find-player";
import { updatePlayerStatsUseCase } from "@/use-cases/update-player-stats";
import type { CommandOptions, SlashCommandProps } from "commandkit";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("update-attribute")
	.setDescription("Update an attribute of your sheet")
	.setNameLocalizations({
		"pt-BR": "atualizar-atributo",
	})
	.setDescriptionLocalizations({
		"pt-BR": "Atualiza um atributo da sua ficha",
	})
	.addStringOption((option) =>
		option
			.setName("attribute")
			.setDescription("Select an attribute to spend your points")
			.setNameLocalizations({
				"pt-BR": "atributo",
			})
			.setDescriptionLocalizations({
				"pt-BR": "Selecione um atributo para gastar seus pontos",
			})
			.addChoices([
				{
					name: "Strength",
					value: "strength",
					name_localizations: { "pt-BR": "Força", "en-US": "Strength" },
				},
				{
					name: "Dexterity",
					value: "dexterity",
					name_localizations: { "pt-BR": "Destreza", "en-US": "Dexterity" },
				},
				{
					name: "Constitution",
					value: "constitution",
					name_localizations: {
						"pt-BR": "Constituição",
						"en-US": "Constitution",
					},
				},
				{
					name: "Intelligence",
					value: "intelligence",
					name_localizations: {
						"pt-BR": "Inteligência",
						"en-US": "Intelligence",
					},
				},
				{
					name: "Wisdom",
					value: "wisdom",
					name_localizations: { "pt-BR": "Sabedoria", "en-US": "Wisdom" },
				},
				{
					name: "Charisma",
					value: "charisma",
					name_localizations: { "pt-BR": "Carisma", "en-US": "Charisma" },
				},
			])
			.setRequired(true),
	)
	.addIntegerOption((option) =>
		option
			.setName("quantity")
			.setDescription("Quantity of points")
			.setNameLocalizations({
				"pt-BR": "quantidade",
			})
			.setDescriptionLocalizations({
				"pt-BR": "Quantidade de pontos",
			})
			.setMinValue(1)
			.setRequired(true),
	);

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.guildId) return;

	const lng = interaction.locale;

	const attribute = interaction.options.getString("attribute", true);
	const quantity = interaction.options.getInteger("quantity", true);

	const sheet = await findPlayerUseCase({
		externalId: interaction.user.id,
		guildId: interaction.guildId,
	});

	if (!sheet) {
		return await interaction.reply({
			content: translate("player.errors.not-found", { lng }),
			flags: "Ephemeral",
		});
	}

	if (sheet.points < quantity || sheet.points === 0) {
		return await interaction.reply({
			content: translate("player.errors.not-enough-points", {
				lng,
				points: sheet.points,
			}),
			flags: "Ephemeral",
		});
	}

	const newStats = sheet.stats.map((stat) => {
		if (stat.label.toLowerCase() === attribute.toLowerCase()) {
			return {
				...stat,
				value: Number(stat.value) + quantity,
			};
		}

		return stat;
	});

	let hp = sheet.hp;
	let mana = sheet.mana;

	if (attribute === "constitution") {
		hp += quantity * 3;
	}

	if (attribute === "intelligence") {
		mana += quantity * 3;
	}

	await updatePlayerStatsUseCase({
		playerId: sheet.id,
		guildId: interaction.guildId,
		stats: newStats,
		points: sheet.points - quantity,
		hp,
		mana,
	});

	return await interaction.reply({
		content: translate("player.points.update", { lng }),
		flags: "Ephemeral",
	});
}

export const options: CommandOptions = {
	devOnly: true,
};

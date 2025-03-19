import { translate } from "@/lib/i18n";
import { findPlayerUseCase } from "@/use-cases/find-player";
import { updatePlayerStatsUseCase } from "@/use-cases/update-player-stats";
import type {
	AutocompleteProps,
	CommandOptions,
	SlashCommandProps,
} from "commandkit";
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
			.setRequired(true)
			.setAutocomplete(true),
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

	await updatePlayerStatsUseCase({
		playerId: sheet.id,
		guildId: interaction.guildId,
		stats: newStats,
		points: sheet.points - quantity,
	});

	return await interaction.reply({
		content: translate("player.points.update", { lng }),
		flags: "Ephemeral",
	});
}

export async function autocomplete({ interaction }: AutocompleteProps) {
	const focusedOption = interaction.options.getFocused(true).value;
	const lng = interaction.locale;

	const attributes = [
		{
			name: translate("attribute.strength", { lng }),
			value: "strength",
		},
		{
			name: translate("attribute.dexterity", { lng }),
			value: "dexterity",
		},
		{
			name: translate("attribute.constitution", { lng }),
			value: "constitution",
		},
		{
			name: translate("attribute.intelligence", { lng }),
			value: "intelligence",
		},
		{
			name: translate("attribute.wisdom", { lng }),
			value: "wisdom",
		},
		{
			name: translate("attribute.charisma", { lng }),
			value: "charisma",
		},
	];

	const result = attributes.filter((item) =>
		item.name.toLowerCase().startsWith(focusedOption.toLowerCase()),
	);

	await interaction.respond(result);
}

export const options: CommandOptions = {
	devOnly: true,
};

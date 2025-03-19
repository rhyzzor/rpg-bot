import { translate } from "@/lib/i18n";
import { findPlayerUseCase } from "@/use-cases/find-player";
import { listPlayersUseCase } from "@/use-cases/list-players";
import { updatePlayerStatsUseCase } from "@/use-cases/update-player-stats";
import type {
	AutocompleteProps,
	CommandOptions,
	SlashCommandProps,
} from "commandkit";
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
			.setAutocomplete(true)
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
	const attribute = interaction.options.getString("attribute", true);
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
		if (stat.label.toLowerCase() === attribute.toLowerCase()) {
			return {
				...stat,
				value: points,
			};
		}

		return stat;
	});

	await updatePlayerStatsUseCase({
		guildId,
		playerId,
		stats: newStats,
		points,
	});

	return await interaction.reply({
		content: translate("player.points.set", {
			lng: interaction.locale,
		}),
		flags: "Ephemeral",
	});
}

export async function autocomplete({ interaction }: AutocompleteProps) {
	if (!interaction.guildId) return;

	const focusedOption = interaction.options.getFocused(true);

	if (focusedOption.name === "sheet") {
		const sheets = await listPlayersUseCase({ guildId: interaction.guildId });

		const filtered = sheets
			.filter((sheet) =>
				sheet.name.toLowerCase().startsWith(focusedOption.value.toLowerCase()),
			)
			.map((sheet) => ({
				name: sheet.name,
				value: sheet.id,
			}));

		return await interaction.respond(filtered);
	}
	if (focusedOption.name === "attribute") {
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
			item.name.toLowerCase().startsWith(focusedOption.value.toLowerCase()),
		);

		return await interaction.respond(result);
	}
}

export const options: CommandOptions = {
	devOnly: true,
	userPermissions: ["Administrator"],
};

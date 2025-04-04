import { sendPrivateMessage } from "@/helpers/send-private-message";
import { translate } from "@/lib/i18n";
import { listPlayersUseCase } from "@/use-cases/list-players";
import { resetPlayerUseCase } from "@/use-cases/reset-player";
import type {
	AutocompleteProps,
	CommandOptions,
	SlashCommandProps,
} from "commandkit";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("reset-sheet")
	.setNameLocalizations({ "pt-BR": "resetar-ficha" })
	.setDescription("Reset a sheet (Inventory, Attributes, Level) [ADMIN]")
	.setDescriptionLocalizations({
		"pt-BR": "Reseta uma ficha (Invetário, Atributos, Level) [ADMIN]",
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
	);

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.guildId) {
		return;
	}

	const guildId = interaction.guildId;

	const playerId = interaction.options.getInteger("sheet", true);

	const sheet = await resetPlayerUseCase({
		guildId,
		playerId,
	});

	if (sheet?.externalId) {
		const member = await interaction.guild?.members.fetch({
			user: sheet.externalId,
		});

		if (member) {
			await sendPrivateMessage(member, interaction, "invite.sheet.reset");
		}
	}

	return await interaction.reply({
		content: translate("player.reset", { lng: interaction.locale }),
		flags: "Ephemeral",
	});
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

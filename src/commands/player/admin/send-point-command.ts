import { translate } from "@/lib/i18n";
import { listPlayersUseCase } from "@/use-cases/list-players";
import { sendPointUseCase } from "@/use-cases/send-point";
import type {
	AutocompleteProps,
	CommandOptions,
	SlashCommandProps,
} from "commandkit";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("send-point")
	.setNameLocalizations({ "pt-BR": "enviar-ponto" })
	.setDescription("Send points to another player")
	.setDescriptionLocalizations({ "pt-BR": "Envia pontos para outro jogador" })
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
			.setName("quantity")
			.setNameLocalizations({ "pt-BR": "quantidade" })
			.setDescription("Quantity")
			.setDescriptionLocalizations({ "pt-BR": "Quantidade" })
			.setRequired(true),
	);

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.guildId) return;

	const guildId = interaction.guildId;

	const playerId = interaction.options.getInteger("sheet", true);
	const quantity = interaction.options.getInteger("quantity", true);

	await sendPointUseCase({ guildId, playerId, quantity });

	return await interaction.reply({
		content: translate("player.points.send", { lng: interaction.locale }),
		flags: "Ephemeral",
	});
}

export async function autocomplete({ interaction }: AutocompleteProps) {
	if (!interaction.guildId) return;

	const guildId = interaction.guildId;

	const focusedOption = interaction.options.getFocused(true);

	const sheets = await listPlayersUseCase({ guildId });

	const filtered = sheets
		.filter((sheet) =>
			sheet.name.toLowerCase().startsWith(focusedOption.value.toLowerCase()),
		)
		.map((sheet) => ({
			name: sheet.name,
			value: sheet.id,
		}));

	await interaction.respond(filtered);
}

export const options: CommandOptions = {
	devOnly: true,
	userPermissions: ["Administrator"],
};

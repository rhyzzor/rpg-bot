import { sendPrivateMessage } from "@/helpers/send-private-message";
import { translate } from "@/lib/i18n";
import { listPlayersUseCase } from "@/use-cases/list-players";
import { restorePlayerUseCase } from "@/use-cases/restore-player";
import type {
	AutocompleteProps,
	CommandOptions,
	SlashCommandProps,
} from "commandkit";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("restore")
	.setNameLocalizations({
		"pt-BR": "restaurar",
	})
	.setDescription("Restore MANA and HP of a sheet [ADMIN]")
	.setDescriptionLocalizations({
		"pt-BR": "Restaura MANA e HP de uma ficha [ADMIN]",
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
			.setName("mana")
			.setDescription("Mana")
			.setRequired(true)
			.setMinValue(0),
	)
	.addIntegerOption((option) =>
		option.setName("HP").setDescription("HP").setRequired(true).setMinValue(0),
	);

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.guildId) {
		return;
	}

	const guildId = interaction.guildId;

	const playerId = interaction.options.getInteger("sheet", true);
	const mana = interaction.options.getInteger("mana", true);
	const hp = interaction.options.getInteger("hp", true);

	const sheet = await restorePlayerUseCase({
		playerId,
		guildId,
		mana,
		hp,
	});

	if (sheet?.externalId) {
		const member = await interaction.guild?.members.fetch({
			user: sheet.externalId,
		});

		if (member) {
			await sendPrivateMessage(member, interaction, "invite.sheet.restore");
		}
	}

	return await interaction.reply({
		content: translate("player.restore", { lng: interaction.locale }),
		flags: "Ephemeral",
	});
}

export async function autocomplete({ interaction }: AutocompleteProps) {
	if (!interaction.guildId) {
		return;
	}

	const focusedOption = interaction.options.getFocused(true).value.trim();

	const sheets = await listPlayersUseCase({
		guildId: interaction.guildId,
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

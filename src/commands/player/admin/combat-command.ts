import { sendPrivateMessage } from "@/helpers/send-private-message";
import { translate } from "@/lib/i18n";
import { combatPlayerUseCase } from "@/use-cases/combat-player";
import { listPlayersUseCase } from "@/use-cases/list-players";
import type {
	AutocompleteProps,
	CommandOptions,
	SlashCommandProps,
} from "commandkit";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("combat")
	.setNameLocalizations({ "pt-BR": "combate" })
	.setDescription(" Mana and HP spent in combat [ADMIN]")
	.setDescriptionLocalizations({
		"pt-BR": "Mana e HP gastos em combate [ADMIN]",
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
		option.setName("hp").setDescription("HP").setRequired(true).setMinValue(0),
	);

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.guildId) {
		return;
	}

	const sheetId = interaction.options.getInteger("sheet", true);
	const mana = interaction.options.getInteger("mana", true);
	const hp = interaction.options.getInteger("hp", true);

	const sheet = await combatPlayerUseCase({
		playerId: sheetId,
		guildId: interaction.guildId,
		mana,
		hp,
	});

	if (sheet?.externalId) {
		const member = await interaction.guild?.members.fetch({
			user: sheet.externalId,
		});

		if (member) {
			const message =
				sheet.status === "dead" ? "invite.sheet.dead" : "invite.sheet.combat";

			await sendPrivateMessage(member, interaction, message);
		}
	}

	return await interaction.reply({
		content: translate("player.combat", { lng: interaction.locale }),
		flags: "Ephemeral",
	});
}

export async function autocomplete({ interaction }: AutocompleteProps) {
	console.log("oii");
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
	permissions: ["ADMINISTRATOR"],
};

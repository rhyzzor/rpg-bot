import { generatePlayerModal } from "@/components/player/modal";
import { sendPrivateMessage } from "@/helpers/send-private-message";
import { translate } from "@/lib/i18n";
import { findPlayerUseCase } from "@/use-cases/find-player";
import { listPlayersUseCase } from "@/use-cases/list-players";
import { updatePlayerUseCase } from "@/use-cases/update-player";
import type {
	AutocompleteProps,
	CommandOptions,
	SlashCommandProps,
} from "commandkit";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("edit-sheet")
	.setDescription("Edit a sheet")
	.setNameLocalizations({
		"pt-BR": "editar-ficha",
	})
	.setDescriptionLocalizations({
		"pt-BR": "Edita uma ficha",
	})
	.addIntegerOption((option) =>
		option
			.setName("sheet")
			.setNameLocalizations({
				"pt-BR": "ficha",
			})
			.setDescription("Player/Extra Character Sheet")
			.setDescriptionLocalizations({
				"pt-BR": "Ficha do Jogador/Personagem Extra",
			})
			.setAutocomplete(true)
			.setRequired(true),
	);

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.guildId || !interaction.guild) return;

	const playerId = interaction.options.getInteger("sheet", true);

	const customId = interaction.id;

	const lng = interaction.locale;

	const player = await findPlayerUseCase({
		guildId: interaction.guildId,
		id: playerId,
	});

	if (!player) {
		return await interaction.reply({
			content: translate("player.errors.not-found", { lng }),
			flags: "Ephemeral",
		});
	}

	const modal = generatePlayerModal({
		name: player.name,
		url: player.url,
		background: player.background,
		extraDetails: player.extraDetails,
		customId,
		title: translate("player.edit.title", { lng }),
		locale: lng,
	});

	await interaction.showModal(modal);

	const modalInteraction = await interaction.awaitModalSubmit({
		filter: (i) => i.customId === customId && i.user.id === interaction.user.id,
		time: 90_000,
	});

	if (!modalInteraction || !modalInteraction.guildId) {
		return await interaction.reply({
			content: translate("player.edit.error", { lng }),
			flags: "Ephemeral",
		});
	}

	const getValue = (field: string) =>
		modalInteraction.fields.getTextInputValue(field);

	const name = getValue("playerNameInput");
	const url = getValue("playerUrlInput");
	const background = getValue("playerBackgroundInput");
	const extraDetails = getValue("playerExtraInput");

	const editedPlayer = await updatePlayerUseCase({
		background,
		guildId: interaction.guildId,
		id: playerId,
		name,
		url,
		extraDetails,
	});

	if (editedPlayer?.externalId) {
		const user = await interaction.guild.members.fetch(editedPlayer.externalId);

		if (user) {
			await sendPrivateMessage(user, interaction, "invite.sheet.edit");
		}
	}

	await modalInteraction.reply({
		content: translate("player.edit.success", { lng }),
		flags: "Ephemeral",
	});

	return;
}

export async function autocomplete({ interaction }: AutocompleteProps) {
	if (!interaction.guildId) {
		return;
	}

	const guildId = interaction.guildId;

	const focusedOption = interaction.options.getFocused(true).value;

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

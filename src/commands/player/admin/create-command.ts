import { generatePlayerModal } from "@/components/player/modal";
import { sendPrivateMessage } from "@/helpers/send-private-message";
import { translate } from "@/lib/i18n";
import { createPlayerUseCase } from "@/use-cases/create-player";
import { listClassesUseCase } from "@/use-cases/list-classes";
import type {
	AutocompleteProps,
	CommandOptions,
	SlashCommandProps,
} from "commandkit";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("create-sheet")
	.setDescription("Create a sheet [ADMIN]")
	.setNameLocalizations({
		"pt-BR": "criar-ficha",
	})
	.setDescriptionLocalizations({
		"pt-BR": "Cria uma ficha [ADMIN]",
	})
	.addIntegerOption((option) =>
		option
			.setName("class")
			.setDescription("Character Class")
			.setNameLocalizations({
				"pt-BR": "classe",
			})
			.setDescriptionLocalizations({
				"pt-BR": "Classe do Personagem",
			})
			.setAutocomplete(true)
			.setRequired(true),
	)
	.addUserOption((option) =>
		option
			.setName("user")
			.setNameLocalizations({
				"pt-BR": "usuário",
				"en-US": "user",
			})
			.setDescription("Usuário")
			.setDescriptionLocalizations({
				"pt-BR": "Usuário do Discord",
				"en-US": "User",
			})
			.setRequired(false),
	);

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.guildId || !interaction.guild) return;

	const user = interaction.options.getUser("user");
	const selectedClass = interaction.options.getInteger("class", true);

	const customId = interaction.id;

	const lng = interaction.locale;

	const modal = generatePlayerModal({
		customId,
		title: translate("player.create.title", { lng }),
		locale: lng,
	});

	await interaction.showModal(modal);

	const modalInteraction = await interaction.awaitModalSubmit({
		filter: (i) => i.customId === customId && i.user.id === interaction.user.id,
		time: 600_000,
	});

	if (!modalInteraction || !modalInteraction.guildId) {
		return await interaction.reply({
			content: translate("player.create.error", { lng }),
			flags: "Ephemeral",
		});
	}

	const getValue = (field: string) =>
		modalInteraction.fields.getTextInputValue(field);

	const name = getValue("playerNameInput");
	const url = getValue("playerUrlInput");
	const background = getValue("playerBackgroundInput");
	const extraDetails = getValue("playerExtraInput");

	await createPlayerUseCase({
		background,
		classId: Number(selectedClass),
		extraDetails,
		guildId: modalInteraction.guildId,
		name,
		url,
		externalId: user?.id,
	});

	await modalInteraction.reply({
		content: translate("player.create.success", { lng }),
		flags: "Ephemeral",
	});

	if (user?.id) {
		await sendPrivateMessage(user, interaction, "invite.sheet.create");
	}

	return;
}

export async function autocomplete({ interaction }: AutocompleteProps) {
	if (!interaction.guildId) {
		return;
	}

	const guildId = interaction.guildId;

	const focusedOption = interaction.options.getFocused(true).value;

	const classes = await listClassesUseCase({
		guildId,
	});

	const result = classes
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

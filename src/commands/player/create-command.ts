import { generatePlayerModal } from "@/components/player/modal";
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
	.setDescription("Create a sheet")
	.setNameLocalizations({
		"pt-BR": "criar-ficha",
	})
	.setDescriptionLocalizations({
		"pt-BR": "Cria uma ficha",
	})
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
			.setRequired(true),
	)
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
	);

export async function run({ interaction }: SlashCommandProps) {
	const user = interaction.options.getUser("user", true);
	const selectedClass = interaction.options.getInteger("class", true);

	const customId = interaction.id;

	const modal = generatePlayerModal({
		customId,
		title: "Criar uma nova ficha",
	});

	await interaction.showModal(modal);

	const modalInteraction = await interaction.awaitModalSubmit({
		filter: (i) => i.customId === customId && i.user.id === interaction.user.id,
		time: 90_000,
	});

	if (!modalInteraction) {
		await interaction.reply({
			content: "Não foi possível criar a ficha",
			flags: "Ephemeral",
		});
		return;
	}

	if (!modalInteraction.guildId) {
		return await modalInteraction.reply("Não foi possível criar a ficha");
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
		externalId: user.id,
	});

	await modalInteraction.reply({
		content: "Ficha criada com sucesso",
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
};

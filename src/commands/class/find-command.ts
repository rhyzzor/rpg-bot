import { translate } from "@/lib/i18n";
import { findClassUseCase } from "@/use-cases/find-class";
import { listClassesUseCase } from "@/use-cases/list-classes";
import type {
	AutocompleteProps,
	CommandOptions,
	SlashCommandProps,
} from "commandkit";
import {
	type ApplicationCommandOptionChoiceData,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("class")
	.setDescription("Show a class")
	.setNameLocalizations({
		"pt-BR": "classe",
	})
	.setDescriptionLocalizations({
		"pt-BR": "Exiba uma classe",
	})
	.addIntegerOption((option) =>
		option
			.setName("name")
			.setDescription("Class name")
			.setNameLocalizations({ "pt-BR": "nome" })
			.setDescriptionLocalizations({ "pt-BR": "Nome da classe" })
			.setRequired(true)
			.setAutocomplete(true),
	);

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.guildId) return;

	const guildId = interaction.guildId;

	const id = interaction.options.getInteger("name", true);

	const selectedClass = await findClassUseCase({ id, guildId });

	if (!selectedClass) {
		return await interaction.reply({
			content: translate("class.errors.not-found", {
				lng: interaction.locale,
			}),
			flags: "Ephemeral",
		});
	}

	const embed = new EmbedBuilder()
		.setTitle(selectedClass.name)
		.setDescription(selectedClass.description)
		.setColor(0x7f000d)
		.setImage(selectedClass.url)
		.addFields({
			name: translate("attribute.label", {
				lng: interaction.locale,
			}).toUpperCase(),
			value: selectedClass.stats
				.map(
					(stat) =>
						`${translate(`attribute.${stat.label.toLowerCase()}`, { lng: interaction.locale })}: **${stat.value}**`,
				)
				.join("\n"),
		});

	return await interaction.reply({ embeds: [embed] });
}

export async function autocomplete({ interaction }: AutocompleteProps) {
	if (!interaction.guildId) return;

	const focusedOption = interaction.options.getFocused(true);

	const classes = await listClassesUseCase({
		guildId: interaction.guildId,
	});

	const filtered: ApplicationCommandOptionChoiceData[] = classes
		.filter((sheet) =>
			sheet.name
				.toLowerCase()
				.startsWith(focusedOption.value.trim().toLowerCase()),
		)
		.map((sheet) => ({
			name: sheet.name,
			value: sheet.id,
		}));

	await interaction.respond(filtered);
}

export const options: CommandOptions = {
	devOnly: true,
};

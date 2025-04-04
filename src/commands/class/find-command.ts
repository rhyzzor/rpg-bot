import classData from "@/assets/class.json";
import { translate } from "@/lib/i18n";
import { findClassUseCase } from "@/use-cases/find-class";
import type { CommandOptions, SlashCommandProps } from "commandkit";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

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
			.setDescription("Select a class")
			.setNameLocalizations({ "pt-BR": "nome" })
			.setDescriptionLocalizations({ "pt-BR": "Selecione uma classe" })
			.setRequired(true)
			.addChoices(
				classData.map((c) => ({
					name: c.name,
					value: c.id,
					name_localizations: { "pt-BR": c.name_ptBR, "en-US": c.name_enUS },
				})),
			),
	);

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.guildId) return;

	const classId = interaction.options.getInteger("name", true);
	const locale = interaction.locale;

	const selectedClass = findClassUseCase({ classId, locale });

	if (!selectedClass) {
		return await interaction.reply({
			content: translate("class.errors.not-found", {
				lng: locale,
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
				lng: locale,
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

export const options: CommandOptions = {
	devOnly: true,
};

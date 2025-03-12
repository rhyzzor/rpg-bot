import { listItemsUseCase } from "@/use-cases/list-items";
import type {
	AutocompleteProps,
	CommandOptions,
	SlashCommandProps,
} from "commandkit";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("update-inventory")
	.setDescription("Update the inventory")
	.setNameLocalizations({
		"pt-BR": "atualizar-inventario",
	})
	.setDescriptionLocalizations({
		"pt-BR": "Atualiza o ivnentário",
	})
	.addStringOption((option) =>
		option
			.setName("sheet")
			.setDescription("Player/Extra Character Sheet")
			.setNameLocalizations({ "pt-BR": "ficha" })
			.setDescriptionLocalizations({
				"pt-BR": "Ficha do Jogador/Personagem Extra",
			})
			.setAutocomplete(true)
			.setRequired(true),
	)
	.addStringOption((option) =>
		option
			.setName("item")
			.setDescription("Item")
			.setRequired(true)
			.setAutocomplete(true),
	)
	.addIntegerOption((option) =>
		option
			.setName("quantity")
			.setDescription("The quantity of the item")
			.setNameLocalizations({
				"pt-BR": "quantidade",
			})
			.setDescriptionLocalizations({
				"pt-BR": "A quantidade do item",
			})
			.setRequired(true),
	);

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.guildId) return;

	const user = interaction.options.getString("user", true);
	const item = interaction.options.getString("item", true);
	const quantity = interaction.options.getInteger("quantity", true);
}

export async function autocomplete({ interaction }: AutocompleteProps) {
	if (!interaction.guildId) return;

	const focusedOption = interaction.options.getFocused(true);

	const guildId = interaction.guildId;

	const items = await listItemsUseCase({
		guildId: guildId,
	});

	const result = items
		.filter((item) =>
			item.name.toLowerCase().startsWith(focusedOption.value.toLowerCase()),
		)
		.map((item) => {
			return {
				name: item.name,
				value: item.id.toString(),
			};
		});

	await interaction.respond(result);
}

export const options: CommandOptions = {
	devOnly: true,
};

import { sendPrivateMessage } from "@/helpers/send-private-message";
import type { ItemDTO, PlayerDTO } from "@/lib/database/schema";
import { createInventoryUseCase } from "@/use-cases/create-inventory";
import { listItemsUseCase } from "@/use-cases/list-items";
import { listPlayersUseCase } from "@/use-cases/list-players";
import type {
	AutocompleteProps,
	CommandOptions,
	SlashCommandProps,
} from "commandkit";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("update-inventory")
	.setDescription("Update the inventory of a sheet [ADMIN]")
	.setNameLocalizations({
		"pt-BR": "atualizar-inventario",
	})
	.setDescriptionLocalizations({
		"pt-BR": "Atualiza o inventário de uma ficha [ADMIN]",
	})
	.addIntegerOption((option) =>
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
	.addIntegerOption((option) =>
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

	const guildId = interaction.guildId;

	const playerId = interaction.options.getInteger("sheet", true);
	const itemId = interaction.options.getInteger("item", true);
	const quantity = interaction.options.getInteger("quantity", true);

	const player = await createInventoryUseCase({
		guildId,
		itemId,
		playerId,
		quantity,
	});

	if (player?.externalId) {
		const member = await interaction.guild?.members.fetch({
			user: player.externalId,
		});

		if (member) {
			await sendPrivateMessage(member, interaction, "invite.sheet.inventory");
		}
	}

	await interaction.reply({
		content: "Inventário atualizado!",
		flags: "Ephemeral",
	});

	return;
}

export async function autocomplete({ interaction }: AutocompleteProps) {
	if (!interaction.guildId) return;

	const focusedOption = interaction.options.getFocused(true);
	const guildId = interaction.guildId;

	const useCaseMap: Record<
		string,
		(params: { guildId: string }) => Promise<ItemDTO[] | PlayerDTO[]>
	> = {
		sheet: listPlayersUseCase,
		item: listItemsUseCase,
	};

	const fetchData = useCaseMap[focusedOption.name];

	const data = await fetchData({ guildId });

	const result = data
		.filter((item) =>
			item.name.toLowerCase().includes(focusedOption.value.toLowerCase()),
		)
		.map((item) => ({
			name: item.name,
			value: item.id,
		}));

	await interaction.respond(result);
}

export const options: CommandOptions = {
	userPermissions: ["Administrator"],
	devOnly: true,
};

import { generateItemModal } from "@/components/item/modal-builder";
import { updateItemUseCase } from "@/use-cases/update-item";
import type { ButtonInteraction, CacheType } from "discord.js";

type ItemDTO = {
	id: number;
	name: string;
	description: string;
	url: string;
	guildId: number;
};

export async function showEditModal(
	item: ItemDTO,
	interaction: ButtonInteraction<CacheType>,
) {
	if (!interaction.guildId) return;

	const customId = `modal#${interaction.id}`;

	const modal = generateItemModal({
		...item,
		title: "Editar item",
		customId,
	});

	await interaction.showModal(modal);

	interaction
		.awaitModalSubmit({
			filter: (i) =>
				i.customId === customId && i.user.id === interaction.user.id,
			time: 60_000,
		})
		.then(async (modalInteraction) => {
			const guildId = modalInteraction.guildId;

			if (!guildId) {
				await modalInteraction.reply("Não foi possível editar o item");
				return;
			}

			const getValue = (field: string) =>
				modalInteraction.fields.getTextInputValue(field);

			const itemName = getValue("itemNameInput");
			const descriptionName = getValue("itemDescriptionInput");
			const imageUrl = getValue("itemUrlInput");

			const id = item.id;

			await updateItemUseCase({
				id,
				name: itemName,
				description: descriptionName,
				guildExternalId: guildId,
				url: imageUrl,
			});

			await modalInteraction.reply({
				content: "Item editado com sucesso",
				flags: "Ephemeral",
			});

			return;
		});
}

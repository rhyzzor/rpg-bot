import { translate } from "@/lib/i18n";
import type { GuildMember, Interaction, User } from "discord.js";

export async function sendPrivateMessage(
	user: User | GuildMember,
	interaction: Interaction,
	messagePath: string,
) {
	if (!interaction.guild || !interaction.channelId) return;

	const channelId = interaction.channelId;

	const invite = await interaction.guild.invites.create(channelId, {
		maxUses: 1,
	});

	const text = `${translate(messagePath, { lng: interaction.locale })}\n${invite.url}`;

	await user.send(text);

	return;
}

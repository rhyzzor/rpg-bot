import { Client, Events, GatewayIntentBits } from "discord.js";
import { commands } from "./commands";
import { deployCommands } from "./commands/deploy";
import { env } from "./env";
import { createGuildUseCase } from "./use-cases/create-guild";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.once(Events.ClientReady, async (readyClient) => {
	console.log("Ready! Logged in as ", readyClient.user.tag);
});

client.on(Events.GuildCreate, async (guild) => {
	await Promise.all([
		deployCommands({ guildId: guild.id }),
		createGuildUseCase(guild.id),
	]);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isCommand()) {
		return;
	}

	const { commandName } = interaction;

	const selectedCommand = Object.values(commands).find(
		(command) => command.data.name === commandName,
	);

	if (selectedCommand) {
		selectedCommand.execute(interaction);
	}
});

client.login(env.DISCORD_TOKEN);

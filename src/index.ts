import { Client, Events, GatewayIntentBits } from "discord.js";
import { commands } from "./commands";
import { deployCommands } from "./commands/deploy";
import { env } from "./env";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.once(Events.ClientReady, (readyClient) => {
	console.log("Ready! Logged in as ", readyClient.user.tag);
});

client.on(Events.GuildCreate, async (guild) => {
	await deployCommands({ guildId: guild.id });
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isCommand()) {
		return;
	}

	const { commandName } = interaction;

	const selectedCommand = commands[commandName as keyof typeof commands];

	if (selectedCommand) {
		selectedCommand.execute(interaction);
	}
});

client.login(env.DISCORD_TOKEN);

console.log(env);

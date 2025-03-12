import { CommandKit } from "commandkit";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { env } from "./env";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

const isDev = env.NODE_ENV === "dev";

const command = new CommandKit({
	client,
	commandsPath: `${__dirname}/commands`,
	bulkRegister: true,
	...(isDev && {
		devGuildIds: [String(env.DISCORD_DEV_GUILD_ID)],
		devUserIds: [String(env.DISCORD_DEV_USER_ID)],
	}),
});

client.once(Events.ClientReady, async (readyClient) => {
	if (isDev) await command.reloadCommands("dev");
	console.log("Ready! Logged in as ", readyClient.user.tag);
});

client.on(Events.InteractionCreate, async (interaction) => {
	// console.log(interaction);
});

client.login(env.DISCORD_TOKEN);

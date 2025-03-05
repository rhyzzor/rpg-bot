import { REST, Routes } from "discord.js";
import { commands } from ".";
import { env } from "../env";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);

type DeployProps = {
	guildId: string;
};

export async function deployCommands({ guildId }: DeployProps) {
	try {
		console.log("Started refreshing application (/) commands.");

		await rest.put(
			Routes.applicationGuildCommands(env.DISCORD_APPLICATION_ID, guildId),
			{
				body: commandsData,
			},
		);

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
}

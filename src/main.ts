import fs from "fs";
import Discord, { Command } from "discord.js";
import "dotenv/config";
import puppeteer from "puppeteer";
import shared from "./common/shared";

const PREFIX = process.env.PREFIX as string;
const TOKEN = process.env.TOKEN as string;

const client = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
		Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Discord.Intents.FLAGS.DIRECT_MESSAGES,
	],
});
client.commands = [];

// Dynamically reading command files from ./commands directory
const commandFolders = fs.readdirSync("./dist/commands");

// Register all commands to the client
for (const folder of commandFolders) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const command = require(`./commands/${folder}/index.js`);
	client.commands.push(command.name, command);
}

client.once("ready", () => {
	console.log("Ready!");
});
//
client.on("messageCreate", async (message) => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;

	const args = message.content.slice(PREFIX.length).trim().split(/\r?\n/)[0].split(/ +/);
	const commandName = (args.shift() as string).toLowerCase();

	const command = client.commands.find(
		(c) => c.name === commandName || c.aliases?.includes(commandName)
	);
	if (!command || command.enabled === false || !message.guild) return;

	try {
		if (
			(command.allowedGuilds || command.allowedUsers) &&
			message.guild &&
			!command.allowedGuilds?.includes(message.guild.id) &&
			!command.allowedUsers?.includes(message.author.id)
		) {
			await message.reply("No permission to run this command");
			return;
		}

		// Executing command dynamically by command name
		await command.execute(message, args);
	} catch (error) {
		await message.reply(`Failed to execute the command: ${(error as Error).message}`);
	}
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isButton()) return;
	const commands = [...client.commands.values()];
	const customId = interaction.customId;
	const prefixId = customId.split("/").shift();

	const command = commands.find((command) => command.buttonInteractionIdPrefix === prefixId);
	if (!command?.buttonInteraction) return;

	try {
		await command.buttonInteraction(interaction);
	} catch (error) {
		await interaction.channel?.send(`Failed to execute the command: ${(error as Error).message}`);
	}
});

(async () => {
	shared.browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
	client.login(TOKEN);
})();

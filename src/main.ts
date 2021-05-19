import fs from "fs";
import Discord, { Command } from "discord.js";
import "dotenv/config";
import puppeteer from "puppeteer";
import shared from "./common/shared";

const PREFIX = process.env.PREFIX as string;
const TOKEN = process.env.TOKEN as string;

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Dynamically reading command files from ./commands directory
const commandFolders = fs.readdirSync("./dist/commands");

// Register all commands to the client
for (const folder of commandFolders) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const command = require(`./commands/${folder}/index.js`);
	client.commands.set(command.name, command);
}

client.once("ready", () => {
	console.log("Ready!");
});

client.on("message", async (message) => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;

	const args = message.content.slice(PREFIX.length).trim().split(/ +/);
	const commandName = (args.shift() as string).toLowerCase();

	if (!client.commands.has(commandName)) return;

	try {
		const command = client.commands.get(commandName) as Command;

		if (command.enabled === false) return;

		if (
			(command.allowedGuilds || command.allowedUsers) &&
			message.guild &&
			!command.allowedGuilds?.includes(message.guild.id) &&
			!command.allowedUsers?.includes(message.author.id)
		) {
			return await message.channel.send("No permission to run this command");
		}

		// Executing command dynamically by command name
		await command.execute(message, args);
	} catch (error) {
		await message.channel.send(`Failed to execute the command: ${error.message}`);
	}
});

(async () => {
	shared.browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
	client.login(TOKEN);
})();

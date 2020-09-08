import fs from "fs";
import Discord from "discord.js";
import "dotenv/config";


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


client.on("message", async message => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;

	const args = message.content.slice(PREFIX.length).trim().split(/ +/);
	const command = (args.shift() as string).toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		// Executing command dynamically by command name
		client.commands.get(command)?.execute(message, args);
	} catch (error) {
		await message.channel.send("Failed to execute the command.");
	}
});


client.login(TOKEN);
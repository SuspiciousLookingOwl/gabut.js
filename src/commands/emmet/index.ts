import { Command } from "discord.js";
import expand from "emmet";

const command: Command = {
	name: "emmet",
	description: "Generate HTML from emmet",
	async execute(message, args) {
		const emmet = args.join(" ").replace(/\\/g, "");
		if (!emmet) return;
		try {
			await message.channel.send(`\`\`\`html\r\n${expand(emmet)}\`\`\``);
		} catch (err) {
			throw new Error("Invalid Emmet");
		}
	},
};

export = command;

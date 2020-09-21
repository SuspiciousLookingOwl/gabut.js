import { Command } from "discord.js";

import run from "./run";

const command: Command = {
	name: "exec",
	description: "Execute code from message",
	args: [
		{
			name: "code",
			description: "Code to execute with code block (```)"
		}
	],
	async execute(message) {
		let script = message.cleanContent.replace(`${process.env.PREFIX}${this.name}`  as string, "").replace(/```/g, "").trim();
		const language = script.split(/\r?\n/)[0];
		script = script.slice(language.length);

		try {
			const response = await run(language, script);
			if (response.error) return await message.channel.send(`Failed to execute <:hanna:596068342431744020>, error: \r\n\r\n ${response.error.trim()}`);
			if (response.output.length > 1900) return await message.channel.send(`Output too long (${response.output.length}) <:hanna:596068342431744020>`);
	
			await message.channel.send(`${response.output.trim()} \r\n\r\n\`Execution time: ${response.cpuTime}\``);
		} catch (err) {
			return await message.channel.send("Failed to execute");
		}
	},
};

export = command;
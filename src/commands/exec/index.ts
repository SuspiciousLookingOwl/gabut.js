import { Command } from "discord.js";

import {run, runTs} from "./run";

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
			const isTypescript = ["ts", "typescript"].includes(language.toLowerCase());
			
			let response, output, time, error;

			if (isTypescript) {
				response = await runTs(script);
				output = response.stdout;
				time = `${response.ms}ms`;
				error = response.stderr === "Compile file:///tmp/mod.tsx\n" ? "" : response.stderr.replace(/(<([^>]+)>)/gi, "");
			} else {
				response = await run(language, script);
				output = response.output;
				time = response.cpuTime;
				error = response.error;
			}

			if (error) return await message.channel.send(`Failed to execute <:hanna:596068342431744020>, error: \r\n\r\n${error.trim()}`);
			if (output.length > 1950) return await message.channel.send(`Output too long (${output.length}) <:hanna:596068342431744020>`);
	
			await message.channel.send(`${output.trim()} \r\n\r\n\`Execution time: ${time}\``);
		} catch (err) {
			throw new Error("Failed to execute code");
		}
	},
};

export = command;
import { Command } from "discord.js";
import fetch from "node-fetch";
import extractCode from "../../common/extractCode";

import { run } from "./run";
import { DenoTownResponse, JDoodleResponse } from "./interfaces";

const command: Command = {
	name: "exec",
	description: "Execute code from message",
	args: [
		{
			name: "code",
			description: "Code to execute with code block (```)",
		},
	],
	async execute(message, args) {
		const [meta] = extractCode(message.cleanContent);
		const attachments = [...message.attachments.values()];

		let language;
		let script;

		if (meta) {
			language = meta.language;
			script = meta.content;
		} else if (attachments.length) {
			const file = await fetch(attachments[0].url);
			script = await file.text();
			language = attachments[0].url.split(".").pop() || "";
		} else {
			return;
		}

		const wrapInCodeBlock = args[0] !== "0" && args[0] !== "false";
		try {
			const isTypescript = ["ts", "typescript"].includes(language.toLowerCase());

			let response, output, time, error;

			if (isTypescript) {
				response = (await run("typescript", script)) as DenoTownResponse;
				output = response.stdout;
				time = `${response.ms}ms`;
				error =
					response.stderr === "Compile file:///tmp/mod.tsx\n"
						? ""
						: response.stderr.replace(/(<([^>]+)>)/gi, "");
			} else {
				response = (await run(language, script)) as JDoodleResponse;
				output = response.output;
				time = response.cpuTime;
				error = response.error;
			}

			if (error)
				return await message.reply(
					`Failed to execute <:hanna:596068342431744020>, error: \r\n\r\n${error.trim()}`
				);
			if (output.length > 1950)
				return await message.reply(
					`Output too long (${output.length}) <:hanna:596068342431744020>`
				);

			let responseString = output.trim();
			if (wrapInCodeBlock) responseString = "```\r\n" + output.trim() + "\r\n```";

			await message.reply(`${responseString}\r\nExecution time: \`${time}\``);
		} catch (err) {
			throw new Error("Failed to execute code");
		}
	},
};

export = command;

import { Command } from "discord.js";
import json2ts from "json-to-ts";
import extractCode from "../../common/extractCode";

const command: Command = {
	name: "json2ts",
	description: "Convert JSON to TypeScript Interface",
	async execute(message) {
		const scripts = extractCode(message.cleanContent);

		for (const script of scripts) {
			try {
				const ts = json2ts(JSON.parse(script.content));
				message.reply("```ts\r\n" + ts.join("\r\n\r\n") + "\r\n```");
			} catch (err) {
				continue;
			}
		}
	},
};

export = command;

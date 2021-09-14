import { Command } from "discord.js";

import translate from "./translate";

const command: Command = {
	name: "tr",
	description: "Translate sentences",
	async execute(message, args) {
		const targetLanguage = args.shift();
		const content = message.content.split(/\s/g);
		const string = content.slice(2).join(" ");

		if (!targetLanguage || !string) return;

		try {
			const translation = await translate(string, targetLanguage);
			if (!translation) return await message.reply("No Translation Found.");
			await message.reply(translation);
		} catch (err: any) {
			if (err.code === 400) {
				throw new Error("Invalid Language");
			} else {
				throw new Error("Failed to translate");
			}
		}
	},
};

export = command;

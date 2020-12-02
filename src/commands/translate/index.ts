import { Command } from "discord.js";

import translate from "./translate";


const command: Command = {
	name: "tr",
	description: "Translate sentences",
	async execute(message, args) {
		const targetLanguage = args.shift();
		const string = args.join(" ");

		if (!targetLanguage || !string) return;

		try {
			const translation = await translate(string, targetLanguage);
			if (!translation) return await message.channel.send("No Translation Found.");
			await message.channel.send(translation);
		} catch (err) {
			if (err.code === 400) {
				throw new Error("Invalid Language");
			} else {
				throw new Error("Failed to translate");
			}
		}
	},
};


export = command;
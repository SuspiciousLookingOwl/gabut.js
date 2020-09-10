import { Command } from "discord.js";

import translate from "./translate";


const command: Command = {
	name: "tr",
	description: "Translate sentences",
	async execute(message, args) {
		const targetLanguage = args.shift();
		const string = args.join(" ");

		if (!targetLanguage || !string) return;

		const translation = await translate(string, targetLanguage);
		await message.channel.send(translation);
	},
};


export = command;
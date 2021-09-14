import { Command } from "discord.js";

import google from "./google";

const command: Command = {
	name: "google",
	description: "GOOGLE IT!!!",
	args: [
		{
			name: "query",
			description: "Google search query",
		},
	],
	async execute(message, args) {
		await message.reply(google(args.join(" ")));
	},
};

export = command;

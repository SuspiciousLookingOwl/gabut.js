import { Command } from "discord.js";

import google from "./google";


const command: Command = {
	name: "google",
	description: "GOOGLE IT!!!",
	async execute(message, args) {
		await message.channel.send(google(args.join(" ")));
	}
};

export = command
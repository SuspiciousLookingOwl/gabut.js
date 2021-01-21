import { Command } from "discord.js";
import owo from "./owo";

const command: Command = {
	name: "owo",
	description: "owoifies a string",
	async execute(message, args) {
		message.channel.send(owo(args.join(" ")));
	},
};

export = command;

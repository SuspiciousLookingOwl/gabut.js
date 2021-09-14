import { Command } from "discord.js";
import { table } from "table";
import extractCode from "../../common/extractCode";

const command: Command = {
	name: "table",
	description: "Create a table from JSON",
	async execute(message) {
		const [json] = extractCode(message.cleanContent);
		const data = table(JSON.parse(json.content));
		await message.reply("```" + data + "```");
	},
};

export = command;

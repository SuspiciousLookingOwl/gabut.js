import { Command } from "discord.js";
import extractCode from "../../common/extractCode";
import mongo from "./mongo";

const command: Command = {
	name: "mongo",
	description: "Execute MongoDB Query",
	async execute(message) {
		const [config, query] = extractCode(message.cleanContent);
		const response = await mongo(config.content, query.content);

		try {
			await message.channel.send(
				"```json\r\n" + JSON.stringify(JSON.parse(response), null, 2) + "```"
			);
		} catch (err) {
			await message.channel.send("```" + response + "```");
		}
	},
};

export = command;

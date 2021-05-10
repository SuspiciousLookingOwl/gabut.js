import { Command } from "discord.js";
import { table } from "table";
import sql, { databases } from "./sql";
import extractCode from "../../common/extractCode";

const command: Command = {
	name: "sql",
	description: "Run SQL query and sends the result",
	async execute(message, args) {
		let database = args[0] as keyof typeof databases;
		if (!(database in databases)) database = "mysql";

		const [schema, query] = extractCode(message.cleanContent);
		if (schema.language.toLowerCase() !== "sql" || query.language.toLowerCase() !== "sql") return;

		const results = await sql(database, schema.content, query.content);
		for (const result of results) {
			const data = table([result?.fields || [], ...(result?.values || [])]);
			await message.channel.send("```\r\n" + data + "\r\n```");
		}
	},
};

export = command;

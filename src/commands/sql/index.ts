import { Command } from "discord.js";
import { table } from "table";
import sql, { databases } from "./sql";

const command: Command = {
	name: "sql",
	description: "Run SQL query and sends the result",
	async execute(message, args) {
		let database = args[0] as keyof typeof databases;
		if (!(database in databases)) database = "mysql";

		const res = message.cleanContent.matchAll(/`{3}([\w]*)\n([\S\s]+?)\n`{3}/gm);
		const [matchedSchema, matchedQuery] = res;
		const [, schemaLanguage, schema] = matchedSchema;
		const [, queryLanguage, query] = matchedQuery;
		if (schemaLanguage.toLowerCase() !== "sql" || queryLanguage.toLowerCase() !== "sql") return;

		const results = await sql(database, schema, query);
		for (const result of results) {
			const data = table([result?.fields || [], result?.values || []]);
			await message.channel.send("```\r\n" + data + "\r\n```");
		}
	},
};

export = command;

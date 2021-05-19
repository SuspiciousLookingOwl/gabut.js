import { Command } from "discord.js";
import fetch from "node-fetch";

const command: Command = {
	name: "shorten",
	description: "Generate shortened using rg.by",
	async execute(message, args) {
		const destination = args[0];
		if (!destination) return;

		const response = await fetch("https://free-url-shortener.rb.gy/shorten", {
			method: "POST",
			body: JSON.stringify({
				destination,
				dryRun: true,
			}),
		});

		const body = await response.json();

		if (response.status !== 200)
			throw new Error(
				`Failed to shorten url: ${body.errors.map((e: any) => e.message).join(", ")}`
			);

		await message.channel.send(body.shortUrl);
	},
};

export = command;

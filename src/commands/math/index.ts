import { Command } from "discord.js";
import math from "math-expression-evaluator";

const command: Command = {
	name: "math",
	description: "Evaluate Mathematic Expression",
	async execute(message, args) {
		try {
			await message.reply(math.eval(args.join(" ")));
		} catch (err) {
			throw new Error("Failed to evaluate Math expression");
		}
	},
};

export = command;

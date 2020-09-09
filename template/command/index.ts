import { Command } from "discord.js";
// Add required dependencies here
// import Example from "some-module";
// import OtherExample from "some-other-module";

const command: Command = {
	name: "[Your Command Name]",
	description: "[Your Command Description]",
	async execute(message, args) {
		// Put your code here

		// const firstArg = args.shift();
		// const secondArg = args.shift();
		
		// await Example.test(firstArg);
		// await OtherExample.test(secondArg);
		// await message.channel.send("Something");
	},
};

export = command;
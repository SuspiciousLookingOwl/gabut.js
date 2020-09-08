import { Message } from "discord.js";
// Add required dependencies here
// import Example from "some-module";
// import OtherExample from "some-other-module";


export = {
	name: "[Your Command Name]",
	description: "[Your Command Description]",
	async execute(message: Message, args: string[]): Promise<void> {
		// Put your code here

		// const firstArg = args.shift();
		// const secondArg = args.shift();
		
		// await Example.test(firstArg);
		// await OtherExample.test(secondArg);
		// await message.channel.send("Something");
	},
};
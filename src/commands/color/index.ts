import { Command, MessageAttachment } from "discord.js";
import Color from "color";
import { createCanvas } from "canvas";

const command: Command = {
	name: "color",
	description: "Show color from color code",
	async execute(message, args) {
		const color = Color(args.join(" "));

		const canvas = createCanvas(200, 200);
		const ctx = canvas.getContext("2d");
		ctx.fillStyle = color.hex();
		ctx.fillRect(0, 0, 2000, 200);

		const attachment = new MessageAttachment(canvas.toBuffer(), color.hex() + ".png");
		await message.reply({ files: [attachment] });
	},
};

export = command;

import { Command, MessageAttachment } from "discord.js";
import QRCode from "qrcode";

const command: Command = {
	name: "qr",
	description: "Generate QR Code from a string",
	async execute(message, args) {
		const content = args.join(" ");

		const buffer = await QRCode.toBuffer(content, { width: 200 });
		const attachment = new MessageAttachment(
			buffer,
			content.replace(/[^a-z0-9]/gi, "").substring(0, 16) + ".png"
		);
		await message.channel.send("", attachment);
	},
};

export = command;

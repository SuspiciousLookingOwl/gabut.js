import { Message } from "discord.js";
import sharp from "sharp";
import fetch from "node-fetch";
import prettyBytes from "pretty-bytes";

export = {
	name: "compress",
	description: "Compress an image sent from attachment",
	async execute(message: Message, args: string[]): Promise<void> {
		if (Array.from(message.attachments).length === 0) return;

		const image = Array.from(message.attachments)[0][1];
		const splitUrl = image.url.split(".");

		const quality = parseInt(args.shift() || "85");
		const imageExtension = args.shift() || splitUrl[splitUrl.length - 1];

		if (!["jpg", "jpeg", "png"].includes(imageExtension)) return;

		const pleaseWaitMessage = await message.reply("Compressing, please wait!");

		const start = new Date().getTime();
		const input = await (
			await fetch(image.url, {
				headers: {
					"Content-Type": "arraybuffer",
				},
			})
		).buffer();
		const oldSize = prettyBytes(image.size);

		const output = await sharp(input)
			.toFormat(imageExtension, {
				quality,
			})
			.toBuffer();

		const newSize = prettyBytes(Buffer.byteLength(output));
		const end = new Date().getTime();

		let content = `Time taken: **__${((end - start) / 1000).toFixed(1)} seconds__**\r\n`;
		content += `Quality: **__${quality}__**\r\n`;
		content += `Old Size: **__${oldSize}__**\r\n`;
		content += `New Size: **__${newSize}__**\r\n`;

		await message.reply({
			content,
			files: [
				{
					attachment: output,
					name: `compressed_${image.name}`,
				},
			],
		});
		await pleaseWaitMessage.delete();
	},
};

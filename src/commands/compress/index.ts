import { Message } from "discord.js";
import sharp from "sharp";
import fetch from "node-fetch";
import prettyBytes from "pretty-bytes";

export = {
	name: "compress",
	description: "Compress an image sent from attachment",
	async execute(message: Message): Promise<void> {
		if (Array.from(message.attachments).length === 0) return;

		const image = Array.from(message.attachments)[0][1];
		const imageExtension = image.url.split(".")[image.url.split(".").length-1];
		
		if (![".jpg", ".jpeg", ".png"].includes(`.${imageExtension}`)) return;
		
		const pleaseWaitMessage = await message.channel.send("Compressing, please wait!");

		const start = new Date().getTime();
		const input = await ((await fetch(image.url, {
			headers: {
				"Content-Type": "arraybuffer"
			}
		})).buffer());
		const oldSize = prettyBytes(image.size);

		const output = await sharp(input).toFormat(imageExtension, {
			quality: 85
		}).toBuffer();

		const newSize = prettyBytes(Buffer.byteLength(output));
		const end = new Date().getTime();

		let content = `Time taken: **__${((end-start)/1000).toFixed(1)} seconds__**\r\n`;
		content += `Old Size: **__${oldSize}__**\r\n`;
		content += `New Size: **__${newSize}__**\r\n`;
        
		await message.channel.send({
			content,
			files: [{
				attachment: output,
				name: `compressed_${image.name}`
			}]
		});
		await pleaseWaitMessage.delete();
        
	}
};
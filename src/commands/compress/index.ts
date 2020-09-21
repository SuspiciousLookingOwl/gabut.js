import { Message } from "discord.js";
import sharp from "sharp";
import axios from "axios";
import prettyBytes from "pretty-bytes";

export = {
	name: "compress",
	description: "Compress an image sent from attachment",
	async execute(message: Message): Promise<void> {

		const image = Array.from(message.attachments)[0][1];
		if (!image.url.endsWith(".jpg") && !image.url.endsWith(".jpeg") && !image.url.endsWith(".png")) return;

		const pleaseWaitMessage = await message.channel.send("Compressing, please wait!");

		const start = new Date().getTime();
		const input = (await axios({ url: image.url, responseType: "arraybuffer" })).data;
		const oldSize = prettyBytes(image.size);

		const output = await sharp(input as Buffer).toFormat("jpeg", {
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
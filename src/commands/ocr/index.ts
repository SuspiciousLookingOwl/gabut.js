import { Command } from "discord.js";
import tesseract from "node-tesseract-ocr";

import downloadFile from "../../common/downloadFile";

const command: Command = {
	name: "ocr",
	description: "Text recognition from picture",
	async execute(message, args) {
		if (Array.from(message.attachments).length === 0) return;
	
		const image = Array.from(message.attachments)[0][1];
		const url = image ? image.url : args.shift();
		if (!url || (!url.endsWith(".jpg") && !url.endsWith(".jpeg") && !url.endsWith(".png"))) return;

		const filePath =  `${__dirname}/${url.split("/").splice(4,3).join(".")}`;
		await downloadFile(url, filePath);
		const text = await tesseract.recognize(filePath, {
			lang: "eng"
		});
		if (text) await message.channel.send(text.trim().replace(/(\n\s*?\n)\s*\n/, "$1"));
		else await message.channel.send("`Text Not Found`");
	},
};

export = command;
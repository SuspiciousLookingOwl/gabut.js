import { Command } from "discord.js";
import { createWorker } from "tesseract.js";

const command: Command = {
	name: "ocr",
	description: "Text recognition from picture",
	async execute(message, args) {
		if (Array.from(message.attachments).length === 0) return;
	
		const image = Array.from(message.attachments)[0][1];
		const url = image ? image.url : args.shift();
		if (!url || (!url.endsWith(".jpg") && !url.endsWith(".jpeg") && !url.endsWith(".png"))) return;
		const worker = createWorker();
		
		await worker.load();
		await worker.loadLanguage("eng");
		await worker.initialize("eng");
		const { data: { text } } = await worker.recognize(url);
		await message.channel.send(text);
		await worker.terminate();
	},
};

export = command;
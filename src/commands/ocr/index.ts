import { Command } from "discord.js";
import tesseract from "node-tesseract-ocr";
import { promises as fs } from "fs";

import downloadFile from "../../common/downloadFile";

const command: Command = {
	name: "ocr",
	description: "Text recognition from picture",
	async execute(message, args) {
		const attachment =
			message.attachments.size > 0 ? [...message.attachments.values()][0] : undefined;

		let lang = "eng";
		let imageUrl;
		if (args.length === 1) {
			if (attachment) lang = args.shift() || "eng";
			else imageUrl = args.shift();
		} else if (args.length >= 2) {
			lang = args.shift() || "eng";
			imageUrl = args.shift();
		}

		const url = attachment?.url || imageUrl;
		if (!url || (!url.endsWith(".jpg") && !url.endsWith(".jpeg") && !url.endsWith(".png"))) return;

		const filePath = `${__dirname}/${message.id}`;
		try {
			await downloadFile(url, filePath);
			const text = await tesseract.recognize(filePath, { lang });
			if (text) await message.reply(text.trim().replace(/(\n\s*?\n)\s*\n/, "$1"));
			else await message.reply("`Text Not Found`");
		} finally {
			await fs.unlink(filePath);
		}
	},
};

export = command;

import { Message } from "discord.js";
import { promises as fs } from "fs";
import fetch from "node-fetch";
import extractCode from "../../common/extractCode";
import shared from "../../common/shared";

export = {
	name: "html",
	description: "Send image preview from HTML",
	async execute(message: Message, args: string[]): Promise<void> {
		const attachments = message.attachments.array();
		let html = "";
		let url = "";

		if (attachments.length === 1 && attachments[0].url.endsWith(".html")) {
			const file = await fetch(attachments[0].url);
			html = await file.text();
		} else if (args.length > 0 && args[0].startsWith("http")) {
			url = args.shift() || "";
		} else {
			const [script] = extractCode(message.cleanContent);
			if (!script) return;
			html = script.content;
		}

		const width = parseInt(args.shift() || "") || 1920;
		const height = parseInt(args.shift() || "") || 1080;
		const random = Math.random().toString(36).substring(7);

		try {
			if (!url) {
				url = `file://${__dirname}/${random}.html`;
				await fs.writeFile(`${__dirname}/${random}.html`, html);
			}

			const page = await shared.browser.newPage();

			await page.setViewport({
				width,
				height,
			});
			await page.goto(url);
			await page.screenshot({
				path: `${__dirname}/${random}.png`,
			});

			await message.channel.send("", { files: [`${__dirname}/${random}.png`] });
			await page.close();
		} catch (err) {
			throw new Error(err);
		} finally {
			if (!url) await fs.unlink(`${__dirname}/${random}.html`);
			await fs.unlink(`${__dirname}/${random}.png`);
		}
	},
};

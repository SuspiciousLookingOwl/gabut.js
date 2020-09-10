import { Message } from "discord.js";
import puppeteer from "puppeteer";
import fs from "fs";
import { promisify } from "util";
import axios from "axios";


export = {
	name: "html",
	description: "Send image preview from HTML",
	async execute(message: Message, args: string[]): Promise<void> {
		const attachments = message.attachments.array();
		if (attachments.length === 0 || !attachments[0].url.endsWith(".html")) return;

		const writeFile = promisify(fs.writeFile);
		const unlink = promisify(fs.unlink);

		const width = parseInt(args.shift() || "") || 1920;
		const height = parseInt(args.shift() || "") || 1080;
		const random = Math.random().toString(36).substring(7);
		const file = await axios.get(attachments[0].url);

		try {
			await writeFile(`${__dirname}/${random}.html`, file.data);
	
			const browser = await puppeteer.launch({ headless: true });
			const page = await browser.newPage();
	
			await page.setViewport({
				width,
				height
			});
			await page.goto(`${__dirname}/${random}.html`);
			await page.screenshot({
				path: `${__dirname}/${random}.png`
			});
	
			await message.channel.send("", { files: [`${__dirname}/${random}.png`] });
			await browser.close();
		} catch (err) {
			console.log(err);
			await message.channel.send("Something went wrong.");
		} finally {
			await unlink(`${__dirname}/${random}.html`);
			await unlink(`${__dirname}/${random}.png`);
		}
	},
};
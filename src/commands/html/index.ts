import { Message } from "discord.js";
import puppeteer from "puppeteer";
import fs from "fs";
import { promisify } from "util";
import axios from "axios";

let browser: puppeteer.Browser;
console.log("Imported");

(async () => {
	browser = await puppeteer.launch({ headless: true });
})();

export = {
	name: "html",
	description: "Send image preview from HTML",
	async execute(message: Message, args: string[]): Promise<void> {
		if (args.length === 0) return;

		const attachments = message.attachments.array();
		let html = "";
		let url = "";

		if (attachments.length === 1 && attachments[0].url.endsWith(".html")) {
			const file = await axios.get(attachments[0].url);
			html = file.data;			
		} else if (args[0].startsWith("http")){
			url = args.shift() || "";
		} else {
			const script = message.cleanContent.replace(`${process.env.PREFIX}${this.name}`  as string, "").replace(/```/g, "").trim();
			const language = script.split(/\r?\n/)[0];
			if (language.toLowerCase() !== "html") return;
			html = script.slice(language.length);
		}
		
		const writeFile = promisify(fs.writeFile);
		const unlink = promisify(fs.unlink);
		const width = parseInt(args.shift() || "") || 1920;
		const height = parseInt(args.shift() || "") || 1080;
		const random = Math.random().toString(36).substring(7);

		try {
			if (!url) await writeFile(`${__dirname}/${random}.html`, html);
	
			const page = await browser.newPage();
	
			await page.setViewport({
				width,
				height
			});
			await page.goto(url ? url : `${__dirname}/${random}.html`);
			await page.screenshot({
				path: `${__dirname}/${random}.png`
			});
	
			await message.channel.send("", { files: [`${__dirname}/${random}.png`] });
			await page.close();
		} catch (err) {
			console.log(err);
			await message.channel.send("Something went wrong.");
		} finally {
			if (!url) await unlink(`${__dirname}/${random}.html`);
			await unlink(`${__dirname}/${random}.png`);
		}
	},
};
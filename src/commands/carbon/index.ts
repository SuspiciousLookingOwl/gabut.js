import { Command } from "discord.js";
import puppeteer from "puppeteer";
import { promisify } from "util";
import fs from "fs";

let browser: puppeteer.Browser;

(async () => {
	browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
})();

const command: Command = {
	name: "carbon",
	description: "Create code screenshot using carbon",
	async execute(message) {
		let script = message.cleanContent
			.replace(`${process.env.PREFIX}${this.name}` as string, "")
			.replace(/```/g, "")
			.trim();
		const language = script.split(/\r?\n/)[0];
		script = script.slice(language.length);
		const unlink = promisify(fs.unlink);

		const page = await browser.newPage();
		await page.setViewport({ width: 3840, height: 2160, deviceScaleFactor: 2 });
		await page.goto(`https://carbon.now.sh/?code=${encodeURIComponent(script)}`);
		await page.waitForSelector(".CodeMirror__container");
		const element = await page.$(".CodeMirror__container");

		const random = Math.random().toString(36).substring(7);
		await element?.screenshot({
			path: `./${random}.png`,
		});
		await message.channel.send("", {
			files: [`./${random}.png`],
		});
		await unlink(`./${random}.png`);
		page.close();
	},
};

export = command;

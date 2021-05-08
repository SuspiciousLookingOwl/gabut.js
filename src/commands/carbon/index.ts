import { Command } from "discord.js";
import { URLSearchParams } from "url";
import { promises as fs } from "fs";
import shared from "../../common/shared";

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

		const page = await shared.browser.newPage();
		await page.setViewport({ width: 3840, height: 2160, deviceScaleFactor: 2 });
		const query = new URLSearchParams({ code: script, bg: "rgba(29, 31, 32, 1)" }).toString();
		await page.goto(`https://carbon.now.sh/?${query}`);
		await page.waitForSelector(".CodeMirror__container");
		const element = await page.$(".CodeMirror__container");

		const random = Math.random().toString(36).substring(7);
		await element?.screenshot({
			path: `./${random}.png`,
		});
		await message.channel.send("", {
			files: [`./${random}.png`],
		});
		await fs.unlink(`./${random}.png`);
		page.close();
	},
};

export = command;

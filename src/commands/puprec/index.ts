import { Command } from "discord.js";
import { promises as fs } from "fs";
import { PuppeteerScreenRecorder, PuppeteerScreenRecorderOptions } from "puppeteer-screen-recorder";

import shared from "../../common/shared";
import extractCode from "../../common/extractCode";
import commandParser from "./commandParser";
import runner from "./runner";

const command: Command = {
	name: "puprec",
	description: "rec open web progress",
	enabled: false,
	async execute(message) {
		const [script] = extractCode(message.cleanContent);
		const commands = commandParser(script.content);

		const page = await shared.browser.newPage();
		await page.setViewport({
			width: 1920,
			height: 1080,
		});

		const random = Math.random().toString(36).substring(7);
		const path = `./video/${random}.mp4`;
		const config: PuppeteerScreenRecorderOptions = {
			followNewTab: false,
			fps: 60,
			videoFrame: {
				width: 1280,
				height: 720,
			},
		};

		try {
			const recorder = new PuppeteerScreenRecorder(page, config);
			await recorder.start(path);
			await runner(page, commands);
			await recorder.stop();

			await message.reply({ files: [path] });
		} finally {
			await page.close();
			await fs.unlink(path);
		}
	},
};

export = command;

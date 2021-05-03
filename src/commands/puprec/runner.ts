import { Page } from "puppeteer";
import { Command } from "./commandParser";

export default async (page: Page, commands: Command[]): Promise<void> => {
	for (const { name, args } of commands) {
		console.log(name, args);
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		await page[name](...args);
	}
};

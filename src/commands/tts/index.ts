import { Command, MessageAttachment } from "discord.js";
import * as tts from "google-tts-api";

const command: Command = {
	name: "tts",
	description: "Send Google TTS",
	async execute(message, args) {
		const lang = args.shift();
		const base64 = await tts.getAudioBase64(args.join(" "), {
			lang,
		});

		const attachment = new MessageAttachment(Buffer.from(base64, "base64"), "tts.wav");

		await message.reply({
			files: [attachment],
		});
	},
};

export = command;

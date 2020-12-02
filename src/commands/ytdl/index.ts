import { Command } from "discord.js";
import { promisify } from "util";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ytdl from "ytdl-core";
import scrapeYt from "scrape-yt";

const command: Command = {
	name: "ytdl",
	description: "Download Youtube video as MP3",
	args: [
		{
			name: "url",
			description: "YouTube video URL"
		}
	],
	async execute(message, args) {
		const url = args.shift();
		if (!url) return;

		const start = Date.now();
		const video = await scrapeYt.search(url, {type: "video"});
		if (video.length === 0) return message.channel.send("Video Not Found");
		if (!video[0].duration || video[0].duration > 600) return message.channel.send("Video can't be longer than 10 minutes");

		const unlink = promisify(fs.unlink);
		const filename = video[0].title.substring(0,48) + ".mp3";
			
		const stream = ytdl(url, { filter: "audioonly" });
		message.channel.send("Please wait while I download the file for you");
			
		ffmpeg(stream)
			.on("end", async () => {
				try {
					const information = `<@!${message.author.id}> Downloaded in ${(Date.now() - start) / 1000}s`;
					await message.channel.send(information, { files: [ `${__dirname}/${filename}` ]});
				} catch (err) {
					if (err.message === "Request entity too large") {
						throw new Error("File size is too big :frowning:");
					} else {
						throw new Error(`Something went wrong! Error: ${err.message}`);
					}
				} finally {
					unlink(`${__dirname}/${filename}`);
				}
			})
			.audioBitrate(96)
			.save(`${__dirname}/${filename}`);
	},
};

export = command;
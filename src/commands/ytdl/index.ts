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

		const unlink = promisify(fs.unlink);

		try{

			const start = Date.now();

			let filename = Math.random().toString(36).substring(7) + ".mp3";
			const video = await scrapeYt.search(url, {type: "video"});
			if (video.length > 0) filename = video[0].title + ".mp3";

			
			const stream = ytdl(url, { filter: "audioonly" });
			message.channel.send("Please wait while I download the file for you");
			
			ffmpeg(stream)
				.on("end", async () => {
					console.log(1);
					try {
						const information = `<@!${message.author.id}> Downloaded in ${(Date.now() - start) / 1000}s`;
						await message.channel.send(information, { files: [ `${__dirname}/${filename}` ]});
						console.log(2);
					} catch (err) {
						if (err.message === "Request entity too large") {
							await message.channel.send("File size is too big :frowning:");
						} else {
							await message.channel.send(`Something went wrong! Error: ${err.message}`);
						}
					} finally {
						unlink(`${__dirname}/${filename}`);
					}
				})
				.audioBitrate(96)
				.save(`${__dirname}/${filename}`);
            
		}catch(err){
			message.channel.send(`Error: ${err.message}`);
		}
	},
};

export = command;
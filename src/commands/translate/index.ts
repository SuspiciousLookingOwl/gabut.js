import { Message } from "discord.js";
import axios from "axios";

const URL = "https://guarded-lowlands-57340.herokuapp.com/";

export = {
	name: "tr",
	description: "Translate sentences",
	async execute(message: Message, args: string[]): Promise<void> {
		const targetLanguage = args.shift();
		const sentences = args.join(" ");

		if (!targetLanguage || !sentences) return;

		const response = await axios.get(`${URL}?to=${encodeURIComponent(targetLanguage)}&text=${encodeURIComponent(sentences)}`);

		await message.channel.send(response.data);
		return response.data;
	},
};
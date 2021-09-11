import { Command, MessageEmbed } from "discord.js";

import define from "./define";

const command: Command = {
	name: "define",
	description: "Define a word",
	args: [
		{
			name: "word",
			description: "Word to define",
		},
	],
	async execute(message, args) {
		const string = args.join(" ");

		if (!string) return;

		try {
			const audio = [];
			const definitions = await define(string);
			const embeds: MessageEmbed[] = [];
			for (const definition of definitions) {
				const embed = new MessageEmbed();

				embed.setTitle(definition.word);
				embed.setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);

				let description = "";
				for (const phonetic of definition.phonetics) {
					description += `**${phonetic.text}**\r\n:sound: ${phonetic.audio}\r\n\u200B\r\n\u200B`;
				}
				embed.setDescription(description);

				for (const meaning of definition.meanings) {
					let fieldContent = "";
					for (const [i, definition] of meaning.definitions.entries()) {
						fieldContent += `__${i + 1}__. ${definition.definition}\r\n`;
						if (definition.example) fieldContent += `*Example*: \`"${definition.example}"\`\r\n`;
						if (definition.synonyms)
							fieldContent += `*Synonyms*: \`${definition.synonyms.join(", ")}\``;
						fieldContent += "\r\n\u200B\r\n\u200B";
					}
					embed.addField(`***${meaning.partOfSpeech}***`, fieldContent, false);
				}

				embed.setFooter("Powered by dictionaryapi.dev");
				audio.push(...definition.phonetics.map((p) => p.audio));
				embeds.push(embed);
			}

			await message.channel.send({ embeds });
			await message.channel.send({
				files: Array.from(new Set(audio)),
			});
		} catch (err) {
			throw new Error("No Definition Found");
		}
	},
};

export = command;

import { TextChannel } from "discord.js";
import { Command, MessageEmbed } from "discord.js";
import ig from "./ig";

const command: Command = {
	name: "ig",
	description: "Get Instagram user information",
	async execute(message, args) {
		const username = args.shift();
		if (!username) return;
		const postLimit = parseInt(args.shift() || "0", 10);
		const user = await ig.getUserData(username);
		if (!user) return;

		const embeds = [];
		const webhook = await (message.channel as TextChannel).createWebhook(`[Instagram] ${user.username}`);

		const embed = new MessageEmbed();
		embed.setAuthor(`${user.fullName} (${user.username})`, user.profilePic, user.link);
		embed.setThumbnail(user.profilePicHD);
		const description = `**${user.postsCount}** posts, ` + 
							`**${user.subscribersCount}** followers, ` +
							`**${user.subscriptions}** following\r\n\r\n` +
							`${user.biography}\r\n${user.link}`;
		embed.setDescription(description);
		embeds.push(embed);


		let embedCount = 0;
		for (const post of user.posts) {
			if(++embedCount > postLimit || embedCount > 9) break;

			const postEmbed = new MessageEmbed();
			postEmbed.setTitle(post.url);
			postEmbed.setURL(post.url);
			postEmbed.setThumbnail(post.imageUrl);
			const description = `**${post.likesCount}** likes, ` + 
								`**${post.commentsCount}** comments\r\n\r\n` +
								`${post.caption|| "\u200B"}`;
			postEmbed.setDescription(description);
			embeds.push(postEmbed);
		}
		await webhook.send(embeds);
		webhook.delete();
	},
};

export = command;
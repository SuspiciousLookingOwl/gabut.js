import { ButtonInteraction, Command, Message, MessageActionRow, MessageButton } from "discord.js";

const command: Command = {
	name: "event",
	description: "Create an event",
	buttonInteractionIdPrefix: "event",
	async execute(message) {
		const row = new MessageActionRow({
			components: [
				new MessageButton({
					customId: `${this.buttonInteractionIdPrefix}/yes`,
					label: "Going",
					style: "SUCCESS",
					emoji: "✔",
				}),
				new MessageButton({
					customId: `${this.buttonInteractionIdPrefix}/no`,
					label: "Not Going",
					style: "DANGER",
					emoji: "✖",
				}),
				new MessageButton({
					customId: `${this.buttonInteractionIdPrefix}/maybe`,
					label: "Maybe",
					style: "PRIMARY",
					emoji: "🤔",
				}),
			],
		});

		const contentSplit = message.content.split(this.name);
		contentSplit.shift();
		const content = contentSplit.join(this.name).trim();

		await message.channel.send({
			content: [
				content,
				"",
				`By <@!${message.author.id}>`,
				`Going: <@!${message.author.id}>`,
				"Not Going:",
			].join("\r\n"),
			components: [row],
		});
	},
	async buttonInteraction(interaction: ButtonInteraction) {
		const message = interaction.message as Message;

		const response = interaction.customId.split("/").pop() as "yes" | "no";

		const messageLines = message.content.split("\r\n").reverse();
		const userId = interaction.user.id;

		const goingIndex = 1;
		const notGoingIndex = 0;

		const getUsers = (s: string) =>
			[...s.matchAll(/<@!([\d]+)>/g)].map((s) => s[1]).filter((id) => id !== userId);

		const goingList = getUsers(messageLines[goingIndex]);
		const notGoingList = getUsers(messageLines[notGoingIndex]);

		if (response === "yes") goingList.push(userId);
		else if (response === "no") notGoingList.push(userId);

		messageLines[goingIndex] = `Going: ${goingList.map((id) => `<@!${id}>`).join(", ")}`;
		messageLines[notGoingIndex] = `Not Going: ${notGoingList.map((id) => `<@!${id}>`).join(", ")}`;

		await interaction.update(messageLines.reverse().join("\r\n"));
	},
};

export = command;

export interface Command {
	name: string;
	args: (string | number | boolean)[];
}

const allowedMethods = {
	goto: ["string"],
	waitForSelector: ["string"],
	type: ["string", "string"],
	click: ["string"],
	waitFor: ["number"],
};

export default (message: string): Command[] => {
	const commandsString = message
		.split(/\r?\n/)
		.map((s) => s.trim())
		.filter((s) => !!s);

	const parsed: Command[] = [];

	for (const commandString of commandsString) {
		const name = commandString.split(" ")[0];
		if (!(name in allowedMethods)) continue;

		const allowedArgs = allowedMethods[name as keyof typeof allowedMethods];

		const regArgs =
			commandString.match(/[^"]+(?=(" ")|"$)/g) || [].slice(0, allowedArgs.length || 0);
		const args = regArgs.map((a, i) => {
			switch (allowedArgs[i]) {
				case "number":
					return +a;
				case "boolean":
					return !!a;
				default:
					return a.toString();
			}
		});

		parsed.push({
			name,
			args,
		});
	}

	return parsed;
};

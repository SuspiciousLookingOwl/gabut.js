import fetch from "node-fetch";
import { DefinitionResult } from "./interfaces";

const URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

export default async function define(string: string): Promise<DefinitionResult[]> {
	const response = await fetch(`${URL}/${encodeURIComponent(string)}`);

	if (response.status !== 200) throw new Error("Definition not found");

	const data = (await response.json()) as DefinitionResult[];
	data.forEach((d) => {
		d.phonetics = d.phonetics.map((p) => {
			p.audio = p.audio.startsWith("http") ? p.audio : `https:${p.audio}`;
			return p;
		});
	});

	return data;
}

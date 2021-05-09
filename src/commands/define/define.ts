import fetch from "node-fetch";
import { DefinitionResult } from "./interfaces";

const URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

export default async function define(string: string): Promise<DefinitionResult[]> {
	const response = await fetch(`${URL}/${encodeURIComponent(string)}`);

	if (response.status !== 200) throw new Error("Definition not found");

	return await response.json();
}

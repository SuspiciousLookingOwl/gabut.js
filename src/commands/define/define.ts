import axios from "axios";
import { DefinitionResult } from "./types";


const URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

export default async function define(string: string): Promise<DefinitionResult[]> {
	const response = await axios.get(`${URL}/${encodeURIComponent(string)}`);

	if (response.status !== 200) throw new Error("Definition not found");

	return response.data;
}
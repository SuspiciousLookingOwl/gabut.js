import fetch from "node-fetch";
import { DenoTownResponse, JDoodleResponse, Language } from "./types";
import deno from "nodeno-town";

export async function run(
	language: string,
	script: string
): Promise<JDoodleResponse | DenoTownResponse> {
	const detectedLanguage = getLanguage(language);

	if (!detectedLanguage.name) throw new Error("No Language Detected");

	if (detectedLanguage.name === "typescript") {
		return await deno(script);
	} else {
		const URL = "https://api.jdoodle.com/v1/execute";
		const data = {
			clientId: process.env.JDOODLE_CLIENT_ID,
			clientSecret: process.env.JDOODLE_CLIENT_SECRET,
			script,
			language: detectedLanguage.name,
			versionIndex: detectedLanguage.versionIndex,
		};

		const response = await fetch(URL, {
			body: JSON.stringify(data),
			method: "POST",
			headers: { "Content-Type": "application/json" },
		});
		return await response.json();
	}
}

export function getLanguage(language: string): Language {
	const supportedLanguages = [
		{
			name: "java",
			alias: ["java"],
			versionIndex: 3,
		},
		{
			name: "c",
			alias: ["c"],
			versionIndex: 4,
		},
		{
			name: "cpp",
			alias: ["cpp", "c++"],
			versionIndex: 4,
		},
		{
			name: "php",
			alias: ["php", "php"],
			versionIndex: 3,
		},
		{
			name: "perl",
			alias: ["perl"],
			versionIndex: 3,
		},
		{
			name: "python3",
			alias: ["py", "python"],
			versionIndex: 3,
		},
		{
			name: "ruby",
			alias: ["ruby"],
			versionIndex: 3,
		},
		{
			name: "go",
			alias: ["go"],
			versionIndex: 3,
		},
		{
			name: "sql",
			alias: ["sql"],
			versionIndex: 3,
		},
		{
			name: "csharp",
			alias: ["c#", "csharp", "cs"],
			versionIndex: 3,
		},
		{
			name: "lua",
			alias: ["lua"],
			versionIndex: 2,
		},
		{
			name: "dart",
			alias: ["dart"],
			versionIndex: 3,
		},
		{
			name: "nodejs",
			alias: ["js", "javascript"],
			versionIndex: 3,
		},
		{
			name: "typescript",
			alias: ["ts", "typescript"],
			versionIndex: 0,
		},
		{
			name: "kotlin",
			alias: ["kt", "kotlin"],
			versionIndex: 2,
		},
	];

	return supportedLanguages.filter((lang) => lang.alias.includes(language))[0] || {};
}

import fetch from "node-fetch";
import FormData from "form-data";

export default async (config: string, query: string): Promise<string> => {
	const formData = new FormData();
	formData.append("config", config);
	formData.append("query", query);

	const response = await fetch("https://mongoplayground.net/run", {
		method: "POST",
		body: formData,
	});

	return await response.text();
};

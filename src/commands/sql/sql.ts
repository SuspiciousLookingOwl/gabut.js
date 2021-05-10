import fetch from "node-fetch";
import { Result, Results } from "./interfaces";

export const databases = {
	mysql: "8-0",
	pgsql: "13",
	sqlite: "3-30",
};

export default async (
	db: keyof typeof databases,
	schema: string,
	query: string
): Promise<(Results | null)[]> => {
	const response = await fetch(`https://prod-api.db-fiddle.com/server/${db}/${databases[db]}`, {
		method: "POST",
		body: JSON.stringify({ schema, query }),
	});

	const body = (await response.json()) as Result;
	const schemaError = body.schema.statements.find((s) => s.error);
	if (schemaError) throw new Error("Schema Error:\r\n ```" + schemaError.error + "```");
	const queryError = body.query.statements.find((s) => s.error);
	if (queryError) throw new Error("Query Error:\r\n ```" + queryError.error + "```");

	return body.query.statements.map((s) => s.results);
};

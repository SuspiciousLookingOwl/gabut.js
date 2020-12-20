import fs from "fs";
import fetch from "node-fetch";

export default async function downloadFile(
	fileUrl: string,
	outputLocationPath: string
): Promise<boolean> {
	const writer = fs.createWriteStream(outputLocationPath);

	const response = await fetch(fileUrl);

	return new Promise((resolve, reject) => {
		response.body.pipe(writer);
		let error: null | Error = null;
		writer.on("error", (err) => {
			error = err;
			writer.close();
			reject(err);
		});
		writer.on("close", () => {
			if (!error) {
				resolve(true);
			}
			//no need to call the reject here, as it will have been called in the
			//'error' stream;
		});
	});
}

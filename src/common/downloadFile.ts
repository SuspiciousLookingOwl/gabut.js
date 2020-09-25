import fs from "fs";
import axios from "axios";

export default async function downloadFile(fileUrl: string, outputLocationPath: string): Promise<boolean> {
	const writer = fs.createWriteStream(outputLocationPath);
  
	return axios({
		method: "get",
		url: fileUrl,
		responseType: "stream",
	}).then((response: any) => {
  
		//ensure that the user can call `then()` only when the file has
		//been downloaded entirely.
  
		return new Promise((resolve, reject) => {
			response.data.pipe(writer);
			let error: null | Error = null;
			writer.on("error", err => {
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
	});
}
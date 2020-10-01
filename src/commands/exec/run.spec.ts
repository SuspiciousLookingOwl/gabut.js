import { getLanguage, run } from "./run";
import "dotenv/config";


test("Test run invalid language", async () => {
	expect(run("wilson", "console.log(1);")).rejects.toThrow();
});

test("Test get language", () => {
	const language = getLanguage("js");

	expect(language.name).toBe("nodejs");
	expect(language.alias).toStrictEqual(["js", "javascript"]);
	expect(language.versionIndex).toBe(3);
});

// ! Temporarily disabling this test because it requires jDoodle credit
// test("Test run javascript code", async () => {
// 	const response = await run("js", "console.log(1);");
// 	expect(response.output.trim()).toBe("1");
// });
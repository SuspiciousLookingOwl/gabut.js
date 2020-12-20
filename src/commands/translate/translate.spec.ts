import translate from "./translate";

test("Test translation to ID", async () => {
	const targetLanguage = "id";
	const string = "What are you doing?";

	const translation = await translate(string, targetLanguage);

	expect(translation).toBe("Apa yang sedang kamu lakukan?");
});

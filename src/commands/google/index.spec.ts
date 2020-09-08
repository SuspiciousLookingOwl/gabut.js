import cmd from "./";


test("Test execute function", async () => {
	// Mocking Discord message object
	const message = {
		channel: {
			send() {
				console.log("Sending Message");
			}
		}
	};
    
	// Mocking args
	const args = ["some", "test"];

	const url = await cmd.execute(message as any, args);

	expect(url).toBe("https://google.com/search?q=some%20test");
});
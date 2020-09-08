import cmd from "./";


test("Test execute function", async () => {
	// Mocking Discord message object
	const message = {
		channel: {
			send() {
				console.log("Sending message");
			}
		}
	};
    
	// Mocking args
	const args = ["id", "What are you doing?"];

	const translation = await cmd.execute(message as any, args);

	expect(translation).toBe("Apa yang sedang kamu lakukan?");	
});
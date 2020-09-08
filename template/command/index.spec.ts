import cmd from "./";


test("Test execute function", () => {
	// Mocking Discord message object
	const message = {
		cleanContent: "Example"
	};
    
	// Mocking args
	const args = ["args1", "args2"];

	cmd.execute(message as any, args);
});
import define from "./define";

test("Test execute function", async () => {
	expect((await define("fruits"))[0].word).toBe("fruits");
});

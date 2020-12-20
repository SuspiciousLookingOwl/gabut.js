import google from "./google";

test("Test google function", async () => {
	const url = google("some test");

	expect(url).toBe("https://google.com/search?q=some%20test");
});

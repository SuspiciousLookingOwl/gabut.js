import owo from "./owo";

test("Test owo function", () => {
	expect(owo("Hello World").startsWith("Hewwo")).toBe(true);
});

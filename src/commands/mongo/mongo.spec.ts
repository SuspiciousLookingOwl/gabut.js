import mongo from "./mongo";

test("Test execute function", async () => {
	const config = JSON.stringify([{ _id: 1, name: "Owl" }]);
	const query = "db.collection.find()";

	expect(await mongo(config, query)).toBe(config);
});

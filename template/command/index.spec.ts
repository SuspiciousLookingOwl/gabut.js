import cmd from "./";
import { mock, when, instance } from "ts-mockito";

import { Message } from "discord.js";


test("Test execute function", () => {
	// Mocking Discord message object
	const mockedMessage:Message = mock(Message);
	// Stubbing getter / read only attribute
	when(mockedMessage.cleanContent).thenReturn("String clean");

	const message = instance(mockedMessage);

	// Mocking args
	const args = ["args1", "args2"];
	// or
	// const args = "args1 args2".trim().split(/ +/);

	cmd.execute(message, args);
});
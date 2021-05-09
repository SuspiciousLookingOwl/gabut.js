export interface DefinitionResult {
	word: string;
	phonetics: Phonetic[];
	meanings: Meaning[];
}

export interface Phonetic {
	text: string;
	audio: string;
}

export interface Meaning {
	partOfSpeech: string;
	definitions: Definition[];
}

export interface Definition {
	definition: string;
	example: string;
	synonyms: string[];
}

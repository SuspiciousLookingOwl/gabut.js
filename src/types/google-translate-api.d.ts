declare module "@vitalets/google-translate-api" {
	interface Options {
		from: string;
		to: string;
		raw: boolean;
		client: string;
		tld: string;
	}

	interface Result {
		text: string;
		pronunciation: string;
		from: {
			language: string;
			text: string;
		};
		raw: string;
	}

	function googleTranslate(text: string, options: Partial<Options>): Promise<Result>;
	export = googleTranslate;
}

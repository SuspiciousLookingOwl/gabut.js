import googleTranslate from "@vitalets/google-translate-api";

export default async function translate(string: string, targetLanguage = "id"): Promise<string> {
	// Language is case sensitive, all is lower case
	targetLanguage = targetLanguage.toLowerCase();

	// For zn-CN and zh-TW
	if (targetLanguage.split("-").length > 1) {
		const targetLanguageSplit = targetLanguage.split("-");
		targetLanguageSplit[1] = targetLanguageSplit[1].toUpperCase();
		targetLanguage = targetLanguageSplit.join("-");
	}

	const response = await googleTranslate(string, { to: targetLanguage });

	return response.text;
}

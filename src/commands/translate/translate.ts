import axios from "axios";


const URL = "https://guarded-lowlands-57340.herokuapp.com/";

export default async function translate(string: string, targetLanguage = "id"): Promise<string> {
	const response = await axios.get(`${URL}?to=${encodeURIComponent(targetLanguage)}&text=${encodeURIComponent(string)}`);
	return response.data;
}
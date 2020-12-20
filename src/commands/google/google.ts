export default function google(query: string): string {
	return `https://google.com/search?q=${encodeURIComponent(query)}`;
}

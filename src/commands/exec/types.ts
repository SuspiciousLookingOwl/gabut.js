export interface JDoodleResponse {
	output: string;
	statusCode: number;
	memory: number;
	cpuTime: number;
	error?: string;
}

export interface DenoTownResponse {
	stdout: string;
	stderr: string;
	ms: number;
}

export interface Language {
	name: string;
	alias: string[];
	versionIndex: number;
}

export interface JDoodleResponse {
    output: string,
    statusCode: number,
    memory: number,
    cpuTime: number,
    error?: string
}

export interface Language {
    name: string,
    alias: string[],
    versionIndex: number
}
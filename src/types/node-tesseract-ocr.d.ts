declare module "node-tesseract-ocr" {

    // https://github.com/tesseract-ocr/tesseract/tree/master/tessdata/configs
    interface Config {
        lang: string;
        oem: number;
        psm: number;
    }

    export function recognize(path: string, config: Partial<Config>): Promise<string>;
}
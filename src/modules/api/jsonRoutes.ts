import { req } from "./routes";

export interface JsonResponse {
    success: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: object;
}

interface OcrResponse extends JsonResponse {
    success: boolean;
    json: {text: string}
}
interface TranslateResponse extends JsonResponse {
    success: boolean;
    json: {text:string, from:string}
}

export const ocr = async (url: string) => {
    return await req('ocr', { url: url }) as OcrResponse;
}

export const translate = async (text: string, target: string) => {
    //                                           ISO-639 code
    //      https://cloud.google.com/translate/docs/languages
    return await req('translate', { text: text, target: target }) as TranslateResponse;
}
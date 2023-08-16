import { ErrorResponse, req } from "./routes";

const json_req = async (endpoint: string, obj: object) => {
    const request = await req(endpoint, obj);
    if ('buffer' in request) throw new Error('Wrong endpoint used!');
    if ('reason' in request) return request as ErrorResponse;
    return request as JsonResponse;
}

export interface JsonResponse extends Response {
    success: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: any;
}

interface OcrResponse extends JsonResponse {
    success: boolean;
    json: {text: string}
}
interface TranslateResponse extends JsonResponse {
    success: boolean;
    json: {text:string, from:string}
}
interface ShazamResponse extends JsonResponse {
    success: boolean;
    json: ShazamMatches;
}

export const ocr = async (url: string): Promise<OcrResponse | ErrorResponse> => {
    return await json_req('ocr', { url: url }) as OcrResponse;
}

export const translate = async (text: string, target?: string): Promise<TranslateResponse | ErrorResponse> => {
    //                                           ISO-639 code
    //      https://cloud.google.com/translate/docs/languages
    return await json_req('translate', { text: text, target: target || "en" });
}

interface ShazamMeta {
    title: string;
    artist: string;

    artistart?: string;
    artistarthq?: string;
    artistartls?: string;


    artists: [{name: string}];

    isrc: string;
    lyrics?: string;
    contentrating?: string;

    openin: {applemusic: string};
    coverart: string;
}
export interface ShazamMatch {
    key: string;
    trackId: string;
    offset?: number;
    metadata: ShazamMeta;
    type: string;
    adamId: string; // apple music
    weburl: string;
}
interface ShazamMatches {
    matches: ShazamMatch[];
    recordingIntermission?: number;
}

export const shazam = async (url: string, offset?: number): Promise<ShazamResponse | ErrorResponse> => {
    return await json_req('shazam', { url: url, offset: (offset || 0).toString() });
}
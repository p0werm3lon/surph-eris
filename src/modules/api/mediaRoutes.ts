import { ErrorResponse, req } from "./routes";

export interface MediaResponse {
    success: boolean,
    buffer: Buffer;
    ext: string;
}

const media_req = async (endpoint: string, obj: object) => {
    const request = await req(endpoint, obj);
    if ('json' in request) throw new Error('Wrong endpoint used!');
    if ('reason' in request) return request as ErrorResponse;
    return request as MediaResponse;
}

export const edit = async (url: string, args: string): Promise<MediaResponse | ErrorResponse> => {
    return await media_req('edit', { url: url, args: args });
}

export const download = async (url: string, audio?: boolean): Promise<MediaResponse | ErrorResponse> => {
    return await media_req('download', { url: url, audio: (audio ? '1' : '0') });
}
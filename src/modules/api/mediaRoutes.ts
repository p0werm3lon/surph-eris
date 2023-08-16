import { req } from "./routes";

export interface MediaResponse {
    success: boolean,
    buffer: Buffer;
    ext: string;
}

export const edit = async (url: string, args: string) => {
    return await req('edit', { url: url, args: args }, true) as MediaResponse;
}

export const download = async (url: string, audio?: boolean) => {
    return await req('download', { url: url, audio: (audio ? '1' : '0') }, true) as MediaResponse;
}
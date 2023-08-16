import path from "path";
import { JsonResponse } from "./jsonRoutes";
import { MediaResponse } from "./mediaRoutes";

interface FailedResponse {
    success: boolean,
    reason: string;
}

const s2h = (str:string) => {
    let x = '';
    for(let i = 0; i < str.length; i++) {
        x += str[i].charCodeAt(0).toString(16);
    }
    return x;
}

export const req = async (endpoint: string, req: object, buffer?: boolean) => {

    let args = `?`;

    for (const [key, value] of Object.entries(req)) {
        args += `${key}=${(
            key == 'url' || typeof parseInt(value) == "number"
        ) ? encodeURI(value) : s2h(value)}&`;
        // hex encode anything that isn't a URL
    }
    const url = `http://127.0.0.1:8738/${endpoint}${args}`.slice(0, -1);
    const send = await fetch(url, { method: 'POST' });
    if (send.status != 200) return {success: false, reason: await send.text()} as FailedResponse;

    const contentheader = send.headers.get('content-disposition');
    if (!contentheader) buffer = false;

    if (buffer && contentheader)
        return { success: true, buffer: Buffer.from(new Uint8Array(await send.arrayBuffer())), ext: path.extname(contentheader) } as MediaResponse;
    else
        return { success: true, json: await send.json() } as JsonResponse;
}
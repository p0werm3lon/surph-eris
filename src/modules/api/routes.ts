import path from "path";
import signale from "signale";

const s2h = (str:string) => {
    let x = '';
    for(let i = 0; i < str.length; i++) {
        x += str[i].charCodeAt(0).toString(16);
    }
    return x;
}

const kpa = async () => {
    try {
        const ping = await fetch(`http://127.0.0.1:8738`);
        if (ping.status != 200) return { success: false, json: { reason: `Keepalive sent ${ping.status} instead of 200` } };
        else return {success:true}
    } catch (e) {
        return { success: false, json: { reason: 'Keepalive request failed, check status of API or some commands won\'t work' } };
    }
}

export const keepalive = async () => {
    kpa().then(res => {
            if (res.success == false && res.json) signale.fatal(res.json.reason);
    });
}


interface SuccessResponse {
    success: true;
}

export interface ErrorResponse {
    success: false;
    reason: string;
}

interface MediaResponse extends SuccessResponse {
    buffer: Buffer;
    ext: string;
}

interface JsonResponse extends SuccessResponse {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: Record<string, any>;
}

type ApiResponse = MediaResponse | JsonResponse | ErrorResponse;

export const req = async (endpoint: string, obj: object): Promise<ApiResponse> => {
    try {

        let args = `?`;

        for (const [key, value] of Object.entries(obj)) {
            args += `${key}=${(
                key == 'url' || !isNaN(parseInt(value))
            ) ? encodeURI(value) : s2h(value)}&`;
            // hex encode anything that isn't a URL
        }
        const url = `http://127.0.0.1:8738/${endpoint}${args}`.slice(0, -1);
        const send = await fetch(url, { method: 'POST' });
        if (send.status != 200) { /*signale.warn('Fetcher: ' + await send.text());*/ return {success: false, reason: await send.text()} }
        const mediaHeader = send.headers.get('content-disposition');
        if (mediaHeader) {
            const buffer = Buffer.from(new Uint8Array(await send.arrayBuffer()));
            return { success: true, buffer, ext: path.extname(mediaHeader) };
        } else {
            const json = await send.json();
            return { success: true, json };
        }
    }
    catch (e) {
        return { success: false, reason:`${e}`};
    }
}
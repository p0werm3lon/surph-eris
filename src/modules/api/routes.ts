import path from "path";
import { JsonResponse } from "./jsonRoutes";
import { MediaResponse } from "./mediaRoutes";
import signale from "signale";

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

const kpa = async () => {
    try {
        const ping = await fetch(`http://127.0.0.1:8738`);
        if (ping.status != 200) return { success: false, reason: `Keepalive sent ${ping.status} instead of 200` };
        else return {success:true}
    } catch (e) {
        return { success: false, reason: 'Keepalive request failed, check status of API or some commands won\'t work' };
    }
}

export const keepalive = async () => {
    kpa().then(res => {
            if (res.success == false) signale.fatal(res.reason);
    });
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
    if (send.status != 200) { signale.warn(send.text()); return { success: false, reason: await send.text() } as FailedResponse; }

    const contentheader = send.headers.get('content-disposition');
    if (!contentheader) buffer = false;

    if (buffer && contentheader)
        return { success: true, buffer: Buffer.from(new Uint8Array(await send.arrayBuffer())), ext: path.extname(contentheader) } as MediaResponse;
    else
        return { success: true, json: await send.json() } as JsonResponse;
}
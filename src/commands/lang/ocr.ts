import Command from "../../classes/Command";
import { ocr } from "../../modules/api/jsonRoutes";
import { getmedia, reply } from "../../modules/util";

export default {
    name: 'ocr',
    run: async (msg) => {
        const url = await getmedia(msg);
        if (!url) { reply('No media', msg); return; }
        const res = await ocr(url);
        if (!res.success) { reply('There was an error OCRing your image. Please try again later.', msg); return; }
        reply('```' + res.json.text + '```', msg);
    },
    options: { aliases: ['scanimage', 'scan', 'scanimg', 'imgscan', 'imagescan', 'ocrimg'] }
} as Command
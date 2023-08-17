import Command from "../../classes/Command";
import { ocr } from "../../modules/api/jsonRoutes";
import { ErrorResponse } from "../../modules/api/routes";
import { ErrorEmbed, OcrEmbed } from "../../modules/embeds";
import { getmedia, reply } from "../../modules/util";

export default {
    name: 'ocr',
    run: async (msg) => {
        const url = await getmedia(msg);
        if (!url) { reply({embed: ErrorEmbed('Couldn\'t find anything to OCR.')}, msg); return; }
        let res = await ocr(url);
        if (!res.success) { res = res as ErrorResponse; reply({embed: ErrorEmbed('There was an error OCRing your image.```' + res.reason + '```')}, msg); return; }
        reply({embed: OcrEmbed(res.json.text)}, msg);
    },
    options: { aliases: ['scanimage', 'scan', 'scanimg', 'imgscan', 'imagescan', 'ocrimg'], usage: '<media>' }
} as Command
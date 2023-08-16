import Command from "../../classes/Command";
import { download } from "../../modules/api/mediaRoutes";
import { getmedia, now, reply } from "../../modules/util";

export default {
    name: 'download',
    run: async (msg) => {
        const url = await getmedia(msg);
        if (!url) { reply('No media', msg); return; }
        const res = await download(url, false);
        if (!res.success) { reply('There was an error downloading your media.', msg); return; }
        reply('', msg, [{ file: res.buffer, name: `${now()}${res.ext}` }]);
    },
    options: { aliases: ['dl'] }
} as Command
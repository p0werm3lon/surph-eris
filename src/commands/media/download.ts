import Command from "../../classes/Command";
import { MediaResponse, download } from "../../modules/api/mediaRoutes";
import { getFlags, getmedia, now, reply } from "../../modules/util";
import { client } from "../../index";
import { ErrorResponse } from "../../modules/api/routes";

export default {
    name: 'download',
    run: async (msg, args) => {

        let audioOnly = false;
        const flags = getFlags(args.join(' '));
        if (flags.filter(x => x == "audio").length != 0) audioOnly = false;

        const url = await getmedia(msg);
        if (!url) { reply('No media', msg); return; }
        await msg.addReaction('loading:1081977500319613039');
        let res = await download(url, audioOnly);
        if (!res.success) {
            res = res as ErrorResponse;
            reply('There was an error downloading your media.\n```' + res.reason + '```', msg);
            msg.removeReaction('loading:1081977500319613039', client.user.id); return;
        }
        res = res as MediaResponse;
        reply('', msg, [{ file: res.buffer, name: `${now()}${res.ext}` }]);
        msg.removeReaction('loading:1081977500319613039', client.user.id);
    },
    options: { aliases: ['dl'], usage: '<media from a service like YouTube or SoundCloud>' }
} as Command
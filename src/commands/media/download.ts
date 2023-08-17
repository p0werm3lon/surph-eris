import Command from "../../classes/Command";
import { MediaResponse, download } from "../../modules/api/mediaRoutes";
import { getFlags, getmedia, now, reaction, reply } from "../../modules/util";
import { ErrorResponse } from "../../modules/api/routes";
import { ErrorEmbed } from "../../modules/embeds";

export default {
    name: 'download',
    run: async (msg, args) => {

        let audioOnly = false;
        const flags = getFlags(args.join(' '));
        if (
            flags.filter(x => x == "audio").length != 0
            || flags.filter(x => x == "a").length != 0
        ) audioOnly = true;

        const url = await getmedia(msg);
        if (!url) { reply({embed: ErrorEmbed('Couldn\'t find anything to download.')}, msg); return; }
        await reaction.add(msg);
        let res = await download(url, audioOnly);
        if (!res.success) {
            res = res as ErrorResponse;
            reply({ embed: ErrorEmbed('There was an error downloading your media.\n```' + res.reason + '```') }, msg);
            await reaction.remove(msg);
        }
        res = res as MediaResponse;
        reply('', msg, [{ file: res.buffer, name: `${now()}${res.ext}` }]);
        await reaction.remove(msg);
    },
    options: { aliases: ['dl'], usage: '<media from a service like YouTube or SoundCloud>' }
} as Command
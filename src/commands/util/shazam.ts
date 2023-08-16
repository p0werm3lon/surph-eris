import Command from "../../classes/Command";
import { ShazamMatch, shazam } from "../../modules/api/jsonRoutes";
import { Embed } from "eris";
import { getmedia, reply } from "../../modules/util";
import { ErrorResponse } from "../../modules/api/routes";

const embeds = {
    match: (match: ShazamMatch) => {
        return {
            title: match.metadata.title,
            url: match.weburl,
            author: { name: match.metadata.artist },
            color: 0x0099FF,
            image: {url: match.metadata.coverart},
            footer: { text: 'Powered by Shazam', icon_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Shazam_icon.svg/2048px-Shazam_icon.svg.png' }
        } as Embed;
    }
}

export default {
    name: 'shazam',
    run: async (msg) => {
        const url = await getmedia(msg);
        if (!url) { reply('No media', msg); return; }
        let res = await shazam(url);
        if (!res.success) { res = res as ErrorResponse;  reply('There was an error Shazam-ing your media.\n'+res.reason, msg); return; }
        if (res.json.matches.length == 0) { reply('No matches found.', msg); return; }
        reply({embed: embeds.match(res.json.matches[0])}, msg);
    },
    options: { aliases: ['songfind', 'findsong', 'matchsong'], usage: '<media>' }
} as Command
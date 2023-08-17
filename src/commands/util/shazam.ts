import Command from "../../classes/Command";
import { shazam } from "../../modules/api/jsonRoutes";
import { getmedia, reaction, reply } from "../../modules/util";
import { ErrorResponse } from "../../modules/api/routes";
import { BasicMessage, ErrorEmbed, Shazam } from "../../modules/embeds";


export default {
    name: 'shazam',
    run: async (msg) => {
        const url = await getmedia(msg);
        if (!url) { reply({embed: ErrorEmbed('Nothing found to Shazam.')}, msg); return; }
        await reaction.add(msg);
        let res = await shazam(url);
        await reaction.remove(msg);
        if (!res.success) { res = res as ErrorResponse; reply({embed: ErrorEmbed(`There was an error Shazam-ing your media.\n\`\`\`${res.reason}\`\`\``)}, msg); return; }
        if (res.json.matches.length == 0) { reply({embed: BasicMessage('No matches found.')}, msg); return; }
        reply({embed: Shazam(res.json.matches[0])}, msg);
    },
    options: { aliases: ['songfind', 'findsong', 'matchsong'], usage: '<media>' }
} as Command
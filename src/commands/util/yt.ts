import Command from "../../classes/Command";
import { ErrorEmbed } from "../../modules/embeds";
import { reaction, reply } from "../../modules/util";
import ytsr from 'ytsr';

export default {
    name: 'youtube',
    run: async (msg, args) => {
        const query = args.join(' ');
        if (args.length == 0) { reply({ embed: ErrorEmbed('Nothing to search for.') }, msg); return; }
        await reaction.add(msg);
        const resp = await ytsr(query);
        const y = resp.items.filter((x) => x.type == 'video')[0];
        await reaction.remove(msg);
        if (y.type != "video") { reply({ embed: ErrorEmbed('No results found.') }, msg); }
        else reply(`${y.url}`, msg);
        return;
    }, options: { aliases: ['yt', 'ytsearch'], usage: '<video query>' }
} as Command
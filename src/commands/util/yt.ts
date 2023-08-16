import Command from "../../classes/Command";
import { reply } from "../../modules/util";
import ytsr from 'ytsr';

export default {
    name: 'youtube',
    run: async (msg, args) => {
        const query = args.join(' ');
        if (args.length == 0) return reply('No query provided.', msg);
        const resp = await ytsr(query);
        const y = resp.items.filter((x)=>x.type=='video')[0];
        if (y.type != "video") return reply('No results found.', msg);
        reply(`**${y.title} by ${y.author?.name}**\n${y.url}`, msg);
        return;
    }, options: { aliases: ['yt', 'ytsearch'], usage: '<video query>' }
} as Command
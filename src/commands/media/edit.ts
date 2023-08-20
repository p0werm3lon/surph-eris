import Command from "../../classes/Command";
import { edit } from "../../modules/api/mediaRoutes";
import { ErrorResponse } from "../../modules/api/routes";
import { ErrorEmbed } from "../../modules/embeds";
import { getmedia, now, reaction, reply, urlregex, isSaneURL } from "../../modules/util";

export default {
    name: 'edit',
    run: async (msg,args) => {
        const url = await getmedia(msg);
        const veb_args = args.join(' ').replace(urlregex, '');

        if (!url) { reply('No media', msg); return; }
        if(!isSaneURL(url, ['mp3', 'm4a', 'm4v', 'webm', 'mp4', 'mkv', 'mov', 'flac', 'wav', 'alac'])) { reply({embed: ErrorEmbed('Invalid media type.')}, msg); return; }
        if (!args) { reply('You didn\'t provide any arguments to edit the video with.', msg); return; }
        
        await reaction.add(msg);
        let res = await edit(url, veb_args);
        await reaction.remove(msg);
        if (!res.success) { res=res as ErrorResponse; reply('There was an error editing your media. ```' + res.reason + '```', msg); return; }
        reply('', msg, [{ file: res.buffer, name: `${now()}${res.ext}` }]);
    },
    options: { aliases: ['veb', 'destroy', 'videoeditbot'], usage: '<VideoEditBot-like syntax args>' }
} as Command
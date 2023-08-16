import Command from "../../classes/Command";
import { edit } from "../../modules/api/mediaRoutes";
import { getmedia, now, reply, urlregex } from "../../modules/util";

export default {
    name: 'edit',
    run: async (msg,args) => {
        const url = await getmedia(msg);
        const veb_args = args.join(' ').replace(urlregex, '');

        if (!url) { reply('No media', msg); return; }
        if (!args) { reply('You didn\'t provide any arguments to edit the video with.', msg); return; }

        const res = await edit(url, veb_args);
        if (!res.success) { reply('There was an error editing your media. Please try again later.', msg); return; }
        reply('', msg, [{ file: res.buffer, name: `${now()}${res.ext}` }]);
    },
    options: { aliases: ['veb', 'destroy', 'videoeditbot'] }
} as Command
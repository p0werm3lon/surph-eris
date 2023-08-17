import Command from "../../classes/Command";
import { translate } from "../../modules/api/jsonRoutes";
import { ErrorResponse } from "../../modules/api/routes";
import { Translation } from "../../modules/embeds";
import { getOptions, reply } from "../../modules/util";

export default {
    name: 'translate',
    run: async (msg, args) => {

        const options = getOptions(args.join(' '));
        console.log(options);

        if (options.formatted === '') { reply('Nothing to translate.', msg); return; }
        let res = await translate(options.formatted, options.options.to || "en");
        if (!res.success) { res = res as ErrorResponse; reply('There was an error translating your image.```' + res.reason + '```', msg); return; }
        reply({embed: Translation(res.json.text)}, msg);
    }, options: { aliases: ['tr'] }
} as Command
import Command from "../../classes/Command";
import { reply } from "../../modules/util";

export default {
    name: 'ping',
    run: async (msg) => {
        reply('yoooo', msg);
    }, options: { aliases: ['pong'] }
} as Command
import Command from "../../classes/Command";
import { reply } from "../../modules/util";
import { PingEmbed } from "../../modules/embeds";

export default {
    name: 'ping',
    run: async (msg) => {
        reply({embed: PingEmbed}, msg);
    }, options: { aliases: ['pong'] }
} as Command
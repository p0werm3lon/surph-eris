import Command from "../../classes/Command";
import { reply } from "../../modules/util";

import pkg from '../../../package.json';
import * as os from 'node:os';

export default {
    name: 'ping',
    run: async (msg) => {
        reply({embed: {color: 0xFFFFFF, title: 'Pong!', type: 'rich', fields: [{name: 'Version', value: `\`${pkg.version}\``}, {name: 'Server', value: `\`${os.hostname()}\``}]}}, msg);
    }, options: { aliases: ['pong'] }
} as Command
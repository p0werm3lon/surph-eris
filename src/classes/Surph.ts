import { ClientOptions, CommandClient, CommandClientOptions } from "eris";
import config from "../../config";
import path from "path";
import { readdirSync } from "fs";
import Command from "./Command";

export class Surph extends CommandClient {
    constructor() {
        super(`Bot ${config.token}`,
            { intents: ["all"] } as ClientOptions,
            { prefix: config.prefix } as CommandClientOptions)
    }

    async register() {
        const dir = await readdirSync(path.join(__dirname, '../commands'));
        dir.every(async folder => { // guaranteed to have subdirectories
            const sub = await readdirSync(path.join(__dirname, '../commands', folder))
                .filter(c => c.endsWith('.js') || c.endsWith('.ts'));
            
            sub.every(async cmdfile => {
                const command: {default: Command} = await import (path.join(__dirname, '../commands', folder, cmdfile));
                this.registerCommand(command.default.name, command.default.run, command.default.options);
            })
            
        })
    }

    start() {
        this.connect();
        this.register();
    }
}
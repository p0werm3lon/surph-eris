import { ClientOptions, CommandClient, CommandClientOptions } from "eris";

import config from "../../config";
import pkg from "../../package.json"

import path from "path";
import { readdirSync } from "fs";
import Command from "./Command";
import { ReminderTimeout } from "../modules/reminders";

import signale from "signale";

export class Surph extends CommandClient {
    timeouts: ReminderTimeout[];

    constructor() {
        super(`Bot ${config.token}`,
            { intents: ["all"] } as ClientOptions,
            { prefix: config.prefix } as CommandClientOptions)
        this.timeouts = [];
    }

    async register() {
        const dir = await readdirSync(path.join(__dirname, '../commands'));
        dir.every(async folder => { // guaranteed to have subdirectories
            const sub = await readdirSync(path.join(__dirname, '../commands', folder))
                .filter(c => c.endsWith('.js') || c.endsWith('.ts'));
            
            sub.every(async cmdfile => {
                const command: {default: Command} = await import (path.join(__dirname, '../commands', folder, cmdfile));
                const cmd = this.registerCommand(command.default.name, command.default.run, command.default.options);
                if (command.default.subcommands) {
                    command.default.subcommands.forEach(sub => {
                        cmd.registerSubcommand(sub.name, sub.run, sub.options);
                })}
            })
            
        })
    }

    async start() {
        await this.register();
        await this.connect();
        signale.start(`Surph ${pkg.version} ready to serve commands`);
        return this;
    }
}
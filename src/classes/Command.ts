import { CommandOptions, Message } from "eris";

export default interface Command {
    name: string;
    run: (msg: Message, args: string[]) => Promise<void>;
    options?: CommandOptions;
}
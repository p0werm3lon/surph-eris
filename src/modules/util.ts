import { Embed, Message, MessageContent } from "eris";

export const reply = async (content: string | {embed?: Embed}, message: Message, files?: [{file: Buffer, name: string}]) => {
    const res: MessageContent = {
        messageReference: { messageID: message.id },
        allowedMentions: { repliedUser: true }
    }
    if (typeof content !== 'string') {
        res.embed = content.embed;
    } else res.content = content;
    
    message.channel.createMessage(res, files);
}

const getrefmsg = (msg: Message) => {
    if (!msg.referencedMessage) return null;
    return msg.referencedMessage;
}
export const urlregex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
export const getmedia = (msg: Message, fromRef?: boolean): string | null => {
    const ref = getrefmsg(msg);
    if (ref && !fromRef) { return getmedia(ref, true) }
    if (msg.attachments.length != 0) return msg.attachments[0].url; // todo: add option to pick from multiple attachments
        //                                                             like a flag: --choose 1 or -c 1
    else {
        const match = msg.content.match(urlregex);
        if (!match) return null;
        return match[0];
    }
}

export const now = () => { return Math.floor(performance.timeOrigin + performance.now()) }; // can't believe this works
export const t2s = (num: number) => { return Math.floor(num / 1000) };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getOptions = (input: string): {options: any, formatted: string} => {
    const optionPattern = /--(\w+)=(\w+)/g;
    const options: Record<string, string> = {};

    let match;
    while ((match = optionPattern.exec(input)) !== null) {
        const [, key, value] = match;
        options[key] = value;
    }

    return { options: options, formatted: input.replace(optionPattern, '') };
}

export const getFlags = (input: string): string[] => {
    const flagPattern = /--(\w+)/g;
    const matches = [];
    let match;

    while ((match = flagPattern.exec(input)) !== null) {
        matches.push(match[1]);
    }

    return matches;
}
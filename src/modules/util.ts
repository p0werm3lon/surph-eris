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
export const getmedia = (msg: Message, fromRef?: boolean): string | null => {
    const ref = getrefmsg(msg);
    if (ref && !fromRef) { return getmedia(ref, true) }
    if (msg.attachments.length != 0) return msg.attachments[0].url; // todo: add option to pick from multiple attachments
        //                                                             like a flag: --choose 1 or -c 1
    else {
        const match = msg.content.match(/https?:\/\/[^\s/$.?#].[^\s]*/gi);
        if (!match) return null;
        return match[0];
    }
}

export const now = () => { return Math.floor(performance.timeOrigin + performance.now()) }; // can't believe this works
import { Duration } from "@sapphire/duration";
import Command from "../../classes/Command";
import { reply, t2s } from "../../modules/util";
import { delReminder, setReminder } from "../../modules/reminders";
import { getUser } from "../../modules/db";

export default {
    name: 'remind',
    run: async (msg, args) => {
        const argsjoined = args.join(' ');
        const time = (new Duration(argsjoined).fromNow).getTime();
        if (!time || isNaN(time)) { reply('Invalid time.', msg); return; }
        
        setReminder(msg.author.id, {
            info: argsjoined, timestamp: time, url: msg.jumpLink,
            ids: { msg: msg.id, user: msg.author.id, channel: msg.channel.id }
        }).then(() => {
            reply(`Your reminder has been added and goes off <t:${t2s(time)}:R>.`, msg)
        })
    }, options: { aliases: ['reminder', 'remindme'] },
    subcommands: [
        {
            name: 'list',
            run: async (msg) => {
                const reminders = (await getUser(msg.author.id)).reminders;
                if (reminders.length == 0) { reply('You have no reminders set.', msg); return; }

                let resp = ``;
                reminders.every(reminder => {
                    resp += `\n<t:${t2s(reminder.timestamp)}:f> • ${reminder.url} • \`${reminder.ids.msg}\`\n\`\`\`${reminder.info}\`\`\`\n`;
                });
                reply(resp.slice(0, -1), msg);
            }, options: { aliases: ['ls'] }
        } as Command,
        {
            name: 'delete',
            run: async (msg,args) => {
                const id = args[0];
                if (isNaN(Number(id))) return reply('No/invalid reminder ID provided.', msg);
                await delReminder(msg.author.id, id);
                msg.addReaction('👌');
            }, options: { aliases: ['remove', 'del', 'rm', 'delete'] }
        } as Command
    ]
} as Command
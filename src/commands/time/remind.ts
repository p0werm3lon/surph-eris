import { Duration } from "@sapphire/duration";
import Command from "../../classes/Command";
import { now, reply, t2s } from "../../modules/util";
import { delReminder, setReminder } from "../../modules/reminders";
import { getUser } from "../../modules/db";
import * as chrono from 'chrono-node';

export default {
    name: 'remind',
    run: async (msg, args) => {
        const argsjoined = args.join(' ');

        let time = (new Duration(argsjoined).fromNow).getTime();
        if (!time || isNaN(time)) {
            const newtime = chrono.parseDate(args.join(' '));
            if (newtime === null) { reply('Invalid time.', msg); return; }
            else {
                const nowtime = new Date(now()*1000);
                newtime.setHours(
                    nowtime.getHours(),
                    nowtime.getMinutes(),
                    nowtime.getSeconds()
                )
                time = newtime.getTime();
            }
           
        }

        time = t2s(time); // divide by 1000 so it can be stored properly
        
        setReminder(msg.author.id, {
            info: argsjoined, timestamp: time, url: msg.jumpLink,
            ids: { msg: msg.id, user: msg.author.id, channel: msg.channel.id }
        }).then(() => {
            reply(`Your reminder has been added and goes off <t:${time}:R>.`, msg)
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
                    resp += `\n<t:${reminder.timestamp}:f> • ${reminder.url} • \`${reminder.ids.msg}\`\n\`\`\`${reminder.info}\`\`\`\n`;
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
            }, options: { aliases: ['remove', 'del', 'rm', 'delete'], usage: '<relative time> <info>' }
        } as Command
    ]
} as Command
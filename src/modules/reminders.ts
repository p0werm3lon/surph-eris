import { DbReminder, getUser, pullDB, setUser } from "./db"
import { now, reply } from "./util";
import { client } from "../index";

import signale from "signale";
import { ReminderPing } from "./embeds";

export const setReminder = async (uid:string, reminder: DbReminder) => {
    const user = await getUser(uid);
    user.reminders.push(reminder);
    await setUser(uid, user);
    watch(reminder);
    return;
}
export const delReminder = async (uid: string, mid: string) => {
    const user = await getUser(uid);
    user.reminders.every((r, i) => {
        if (r.ids.msg === mid) user.reminders.splice(i, 1);
    });
    await setUser(uid, user);
    return;
}

export interface ReminderTimeout {
    mid: string;
    timeout: NodeJS.Timeout;
}

const watch = async (reminder: DbReminder) => {
    if (((reminder.timestamp*1000) - (now()*1000)) > 2**31) { signale.note(`Not polling reminder ${reminder.ids.msg} with timestamp ${reminder.timestamp} because it does not go off in the next ~24 days`); return; }
    client.timeouts.push(
        {
            mid: reminder.ids.msg,
            timeout: setTimeout(async () => {
                signale.info(`Reminder with ID ${reminder.ids.msg} is finished polling`);
                const ref = await client.getMessage(reminder.ids.channel, reminder.ids.msg);
                if (!ref) return; // cba
                reply({embed: ReminderPing(reminder)}, ref);
                await delReminder(reminder.ids.user, reminder.ids.msg);
            }, ((reminder.timestamp*1000) - (now()*1000)))
        } as ReminderTimeout);
    signale.start(`Started polling reminder ${reminder.ids.msg}`);
}

export const continueWatching = async () => {
    const db = await pullDB();
    db.every(user => {
        user.value.reminders.every(async (reminder) => {
            if ((reminder.timestamp*1000) < (now()*1000)) { await delReminder(reminder.ids.user, reminder.ids.msg); return; }
            if (client.timeouts.filter(x => x.mid === reminder.ids.msg)) return; // do not add if already watching (pls work)
            watch(reminder);
        });
    });
    signale.start(`Started watching ${client.timeouts.length} reminder(s)`);
}
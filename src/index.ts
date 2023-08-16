// import signale from 'signale';

import { Surph } from "./classes/Surph";
import { keepalive } from "./modules/api/routes";
import { continueWatching } from "./modules/reminders";

export const client = new Surph();
(async () => { 
    await client.start();
    keepalive();

    // Keepalive for API
    setInterval(async () => {keepalive()}, 3000)

    continueWatching();

})();
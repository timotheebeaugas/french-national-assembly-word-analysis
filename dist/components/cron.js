const CronJob = require('cron').CronJob;
let job = new CronJob("0 0 * * *", function () {
}, null, true, "Europe/Paris");

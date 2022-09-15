var CronJob = require('cron').CronJob;
var job = new CronJob("0 0 * * *", function () {
}, null, true, "Europe/Paris");

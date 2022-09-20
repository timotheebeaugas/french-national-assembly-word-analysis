const CronJob = require('cron').CronJob;

let job = new CronJob(
  "0 0 * * *",
  function () {
    // run task here
  },
  null,
  true,
  "Europe/Paris"
);

let investorsHub = require('./lib/investorsHub'),
    notification = require('./lib/notification'),
    CronJob = require('cron').CronJob;

new CronJob('0 16 * * *', () => {
    investorsHub.getBreakoutBoard().then(data => {
        console.log(data);
        notification.sendMessage('Stock market script finished scraping');
    });
}, null, true, 'America/New_York');
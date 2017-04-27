let investorsHub = require('./lib/investorsHub'),
    notification = require('./lib/notification'),
    _ = require('underscore'),
    CronJob = require('cron').CronJob;

new CronJob('0 16 * * *', () => {
    investorsHub.getBreakoutBoard().then((data) => {
        let flaggedTickers = [];
        _.each(data, tickerObj => {
            try {
                let length = tickerObj.scrapes.length;

                if (length > 1) {
                    let last = tickerObj.scrapes[length - 1],
                        penultimate = tickerObj.scrapes[length - 2],
                        postsToday = penultimate.postsToday - last.postsToday,
                        ticker = last.ticker;

                    if (postsToday > 200) {
                        flaggedTickers.push({
                            ticker,
                            postsToday
                        })
                    }
                }
            } catch(err) {
                console.log(err);
            }
        });

        let message = "";

        if (flaggedTickers > 0) {
            flaggedTickers.each(tickerObj => {
                message += `${tickerObj.ticker} had ${tickerObj.postsToday}\n`;
            });

            notification.sendMessage(`
            Market Scrape Finished\n${message}
        `);
        }
        else
        {
            notification.sendMessage(`
            Market Scrape Finished\nNo tickers to watch :(
        `);
        }
    });
}, null, true, 'America/New_York');
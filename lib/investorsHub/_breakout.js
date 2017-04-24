let scraper = require('../scraper'),
    _ = require('underscore'),
    Q = require('q');

class Breakout {
    constructor(parseTableConfig) {
        this.baseUrl = 'https://investorshub.advfn.com/';
        this.parseTableConfig = parseTableConfig;
    }
    scrapeBreakout() {
        let deferred = Q.defer(),
            rowsToThrow = [];

        scraper.scrape(`${this.baseUrl}/boards/breakoutboards.aspx`, this.parseTableConfig).then(data => {
            deferred.resolve(data);
        });

        return deferred.promise;
    }
}

module.exports = new Breakout();
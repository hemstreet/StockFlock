let scraper = require('../scraper'),
    Q = require('q');

class Boards {
    constructor(parseTableConfig, baseUrl) {
        this.parseTableConfig = parseTableConfig;
        this.baseUrl = baseUrl;
    }
    scrapeMostPosted() {
        return this._scrape('most_post');
    }
    scrapeBreakout() {
        return this._scrape('breakoutboards');
    }
    _scrape(board, parseTableOverride) {
        let deferred = Q.defer();

        let parseTable = parseTableOverride || this.parseTableConfig;
        scraper.scrape(`${this.baseUrl}/boards/${board}.aspx`, parseTable).then(data => {
            deferred.resolve(data);
        });

        return deferred.promise;
    }
}

module.exports = Boards;
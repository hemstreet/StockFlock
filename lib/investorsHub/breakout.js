let scraper = require('../scraper'),
    _ = require('underscore'),
    Q = require('q');

class Breakout {
    scrapeBreakout() {
        let deferred = Q.defer();

        scraper.scrape("https://investorshub.advfn.com/boards/breakoutboards.aspx", {
            rowHeaders: {
                selector: "table tr th",
                how: rows => {
                    let rowHeaders = [];
                    _.each(rows, row => {
                        rowHeaders.push(row.children[0].data);
                    });
                    
                    return rowHeaders;
                },
            },
            entries: {
                selector: "table .dter, table .dtor",
                convert: _haystacks => {
                    let haystacks = _haystacks.split('\r\n\t\t\r\n\t\t\t\n');

                    let rows = [];
                    haystacks.forEach(haystack => {
                        // var match;
                        let cleanHaystack = haystack.replace(/\s\s\s\s\s+/g, '[XYZ123]'),
                            chunks = cleanHaystack.split('[XYZ123]'),
                            ticker = chunks[5];

                        if(!ticker) return;

                        rows.push({
                            name: chunks[2],
                            rate: chunks[3],
                            postsToday: +chunks[4],
                            ticker,
                            last: +chunks[6],
                            change: +chunks[7],
                            percentChange: chunks[8],
                            volume: +chunks[9].replace(/,/g, '') // Strip commas from number
                        });
                    });

                    return rows;
                }
            }
        }).then(data => {
            deferred.resolve(data);
        });

        return deferred.promise;
    }
}

module.exports = new Breakout();
const scrapeIt = require("scrape-it");
let Q = require('q');

class Scraper {
    scrape(url, options) {

        let deferred = Q.defer();
        scrapeIt(url, options).then(page => {
            deferred.resolve(page);
        });
        
        return deferred.promise;
    }
}

module.exports = new Scraper();
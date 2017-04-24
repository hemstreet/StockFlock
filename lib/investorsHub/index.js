let breakout = require('./breakout');

class InvestorsHub {
    getBreakoutBoard() {
        return breakout.scrapeBreakout();
    }
}

module.exports = new InvestorsHub();
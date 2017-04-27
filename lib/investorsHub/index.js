let Boards = require('./Boards'),
    _ = require('underscore'),
    db = require('../db'),
    Q = require('q'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

class InvestorsHub {
    constructor() {
        this.baseUrl = 'https://investorshub.advfn.com/';
        this.parseTableConfig = this._getParseTableConfig();
        this.boards = new Boards(this._getParseTableConfig(), this.baseUrl);
        this.db = db;
        this.models = {};
        this.schemas = {};
        this._setupMongo();
        this.scrapes = {};
    }
    getBreakoutBoard() {
        let deferred = Q.defer();

        this.boards.scrapeBreakout().then(data => {
            _.forEach(data.entries, (entry, index) => {
                let obj = data.entries[index];
                obj.date = new Date();

                if(this.scrapes[entry.ticker]) {
                    this.scrapes[entry].scrapes.push(obj);
                }
                else
                {
                    this.scrapes[entry.ticker] = {
                        scrapes: [ obj ]
                    };
                }
            });

            deferred.resolve(this.scrapes);

        });

        return deferred.promise;
    }
    getMostPosted() {
        return this.boards.scrapeMostPosted().then(data => {
            console.log(data);
        });
    }

    /**
     * Build our list of schemas to reference later, we use the key as the model name
     */
    _setupMongo() {
        this.schemas = {
            Tickers: new Schema({
                symbol: {
                    type: String,
                    unique: true
                },
                url: String
            }),
            Entries: new Schema({
                Ticker: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Ticker'
                },
                date: Date,
                name: String,
                rate: String,
                postsToday: Number,
                last: Number,
                change: Number,
                percentChange: Number,
                volume: Number
            }, {collection: 'Entry'})
        };

        _.forEach(this.schemas, (schema, key) => {
            this.models[key] = mongoose.model(key, schema);
        });
    }
    _getParseTableConfig() {
        let rowsToThrow = [];
        return {
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
                    haystacks.forEach((haystack, index) => {
                        // var match;
                        let cleanHaystack = haystack.replace(/\s\s\s\s\s+/g, '[XYZ123]'),
                            chunks = cleanHaystack.split('[XYZ123]'),
                            ticker = chunks[5];

                        if(!ticker) {
                            rowsToThrow.push(index);
                            return
                        }

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
            },
            links: {
                selector: "table .dter td:nth-child(2) a, table .dtor td:nth-child(2) a",
                how: rows => {

                    let links = [];
                    _.each(rows, (row, index) => {
                        if (rowsToThrow.indexOf(index) > -1) return;
                        links.push(`${this.baseUrl}${row.attribs.href.split('../')[1]}`);
                    });

                    return links;
                },
            }
        };
    }
}

module.exports = new InvestorsHub();
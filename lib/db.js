var mongoose = require('mongoose'),
    _ = require('underscore'),
    Q = require('q');

class Database {
    constructor() {
        this.db = mongoose.connect('mongodb://localhost/StockFlock');
    }
    create(Model, data) {
        let deferred = new Q.defer();

        Model.create(data, (err, model) => {
            if (err) deferred.reject(err);
            deferred.resolve(model)
        });

        return deferred.promise;
    }
    read(Model, query) {
        let deferred = new Q.defer();

        Model.findOne(query, (err, model) => {
            if (err) deferred.reject(err);
            deferred.resolve(model)
        });

        return deferred.promise;
    }
}

module.exports = new Database();

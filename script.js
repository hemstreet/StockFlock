let investorsHub = require('./lib/investorsHub');

// Promise interface
investorsHub.getBreakoutBoard().then(data => {
    console.log(data);
});
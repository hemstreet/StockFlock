let investorsHub = require('./lib/investorsHub/index');

// Promise interface
investorsHub.getBreakoutBoard().then(data => {
    console.log(data);
});
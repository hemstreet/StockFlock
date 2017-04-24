let scrapeIt = require("scrape-it"),
    Q = require('q'),
    twilio = require('twilio');

class Notification {
    constructor() {
        this.twilioClient = new twilio.RestClient('ACb3f74cd08401abb32b14f7058060edd4', '56891127bfe368b35dec37e6e974d747');
    }
    sendMessage(body) {

        this.twilioClient.sms.messages.create({
            to:'+18152636742',
            from:'+17209999277',
            body
        }, function(error, message) {
            // The HTTP request to Twilio will run asynchronously. This callback
            // function will be called when a response is received from Twilio
            // The "error" variable will contain error information, if any.
            // If the request was successful, this value will be "falsy"
            if (!error) {
                // The second argument to the callback will contain the information
                // sent back by Twilio for the request. In this case, it is the
                // information about the text messsage you just sent:
                console.log('Success! The SID for this SMS message is:');
                console.log(message.sid);

                console.log('Message sent on:');
                console.log(message.dateCreated);
            } else {
                console.log('Oops! There was an error.');
            }
        });
    }
}

module.exports = new Notification();
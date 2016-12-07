'use strict';

//
// In order to send, the fromAddress needs to be a verified email address within Amazon SES
//

var AWS = require('aws-sdk');
var SES = new AWS.SES({region: 'us-east-1'});

module.exports.send = (fromAddress, toAddress, subject, message, callback) => {
    var params = {
        Destination: {
            ToAddresses: [toAddress]
        },
        Message: {
            Body: {
                Text: {
                    Data: message
                }
            },
            Subject: {
                Data: subject
            }
        },
        Source: fromAddress
    };

    SES.sendEmail(params, function (err, data) {
        callback(err == null);
    });
}

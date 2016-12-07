'use strict';

module.exports.sendPush = (serverKey, deviceToken, title, body, callback) => {
    var FCM = require('fcm-push');
    var fcm = new FCM(serverKey);

    var message = {
        to: deviceToken,
        priority: 'high',
        data: {
            sound: "default",
            badge: "1",
            title: title,
            body: body,
            message: body
        }
        /*,
        notification: {
            sound: "default",
            badge: "1",
            title: title,
            body: body
        }*/
    };

    fcm.send(message)
        .then(function(response){
            console.log("Successfully sent with response: ", response);
            callback(true);
        })
        .catch(function(err){
            console.log("Something has gone wrong!");
            console.error(err);
            callback(false);
        })
}

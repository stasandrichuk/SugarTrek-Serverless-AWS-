const uuid = require('uuid');
const moment = require('moment');
const geolib = require('geolib');
var async = require('async');

const FROM_EMAIL_ADDRESS = "eric@oakcityapps.com";
const STRIPE_TEST_KEY = "sk_test_sxN7MA06XEXwDkd3Y6C5EvF4";
const STRIPE_PRODUCTION_KEY = "sk_live_0fU1UiapEBB2zq2BdqrIWKNU";
const FCM_SERVER_KEY = "AIzaSyBjVC0QMAt7j0QphaJb8Ai5-gdBylaHmpA";

var dataAccess = require("./commonjs/dataAccess");
var sendMail = require("./commonjs/sendMail");
var crypto = require("./commonjs/crypto");
var payment = require("./commonjs/payment");
var notification = require("./commonjs/notification");

var USER_TABLE = "SugarTrek_User";
var BUSINESS_TABLE = "SugarTrek_Business";
var PROMOTION_TABLE = "SugarTrek_Promotion";
var PROMOTION_INSTANCE_TABLE = "SugarTrek_PromotionInstance";

var ERROR_CODE_DUPLICATE_EMAIL = "200";
var ERROR_CODE_WRONG_USER_PASSWORD = "300";

var BUSINESS_PROMOTION_NOTIFICATION_DISTANCE = 16093.4;

module.exports.signup = (event, context, callback) => {
    var eventBody = event.body ? event.body : event;
    var email = eventBody.email;
    var name = eventBody.name;

    dataAccess.filter(USER_TABLE, "email", email, function(userData) {
        if (userData != null && userData.length > 0) {
            callback(null, ERROR_CODE_DUPLICATE_EMAIL)

        } else {
            crypto.encrpyt(eventBody.password, function (encrpytedPassword) {
                var userId = uuid.v1();
                var items = {
                    "userId": userId,
                    "email": email,
                    "password": encrpytedPassword,
                    "name": name,
                    "image": "null",
                    "latitude": 0.0,
                    "longitude": 0.0,
                    "notificationToken": "null"
                };

                dataAccess.save(USER_TABLE, items, function (data) {
                    callback(null, userId);
                });
            });
        }
    });
};

module.exports.login = (event, context, callback) => {
    var eventBody = event.body ? event.body : event;
    var email = eventBody.email;
    var clearPassword = eventBody.password;

    dataAccess.filter(USER_TABLE, "email", email, function(userData) {
        if (userData != null && userData.length > 0) {
            crypto.decrypt(userData[0].password, function (decryptedPassword) {

                console.log(decryptedPassword);
                if (clearPassword == decryptedPassword) {

                    dataAccess.filter(BUSINESS_TABLE, "businessUserId", userData[0].userId, function(businessData) {
                        if (businessData != null && businessData.length > 0) {
                            callback(null, businessData[0].businessId);
                        } else {
                            callback(null, userData[0].userId);
                        }
                    });

                } else {
                    callback(null, ERROR_CODE_WRONG_USER_PASSWORD);
                }
            });

        } else {
            callback(null, ERROR_CODE_WRONG_USER_PASSWORD);
        }
    });
};

exports.forgotPassword = function(event, context, callback) {
    var eventBody = event.body ? event.body : event;
    var toEmailAddress = eventBody.email;
    var subject = "Your password for SugarTrek";

    dataAccess.filter(USER_TABLE, "email", toEmailAddress, function(data) {
        if (data == null || data.length == 0) {
            callback(null, "false");
        } else {
            var message = "Your password for sugartrek is: " + data[0].password;
            sendMail.send(FROM_EMAIL_ADDRESS, toEmailAddress, subject, message, function(err, data) {
                callback(null, "true");
            });
        }
    });
}

exports.charge = function(event, context, callback) {
    var amount = event.amount;
    var currency = event.currency;
    var source = event.token;
    var description = event.description;

    payment.charge(STRIPE_TEST_KEY, amount, currency, source, description, function(data) {
        callback(null, data);
    });
}

exports.sendPush = function(event, context, callback) {
    var deviceToken = event.deviceToken;
    var title = event.title;
    var body = event.body;

    notification.sendPush(FCM_SERVER_KEY, deviceToken, title, body, function(data) {
        callback(null, data);
    });
}

exports.sendNotificationsForPromotion = function(event, context, callback) {
    var eventBody = event.body ? event.body : event;

    console.log("promotionId: " + eventBody.promotionId);

    dataAccess.filter(PROMOTION_TABLE, "promotionId", eventBody.promotionId, function (data) {
        var promotion = data[0];
        dataAccess.filter(BUSINESS_TABLE, "businessId", promotion.promotionBusinessId, function (data) {
            var business = data[0];
            dataAccess.get(USER_TABLE, function (data) {

                async.eachSeries(data, function (user, seriesCallback) {
                    if (user.latitude != undefined && user.longitude != undefined && user.notificationToken != undefined) {
                        var deviceToken = user.notificationToken;
                        var distance = geolib.getDistance(
                            {latitude: business.businessLatitude, longitude: business.businessLongitude},
                            {latitude: user.latitude, longitude: user.longitude}
                        );
                        if (distance <= BUSINESS_PROMOTION_NOTIFICATION_DISTANCE) {
                            var message = business.businessName + " has started a new promotion";
                            notification.sendPush(FCM_SERVER_KEY, deviceToken, "new promotion", message, function (data) {
                                console.log("notification sent to " + deviceToken);
                            });
                        }
                    }

                    seriesCallback();

                }, function (err) {
                    callback(null, true);
                });
            })
        })
    })
}

exports.saveBusinessLogin = function(event, context, callback) {
    var eventBody = event.body ? event.body : event;

    crypto.encrpyt(eventBody.password, function(encrpytedPassword) {
        var userId = uuid.v1();
        var userItems = {
            "userId": userId,
            "email": eventBody.email,
            "password": encrpytedPassword,
            "name": "null",
            "image": "null",
            "latitude": 0.0,
            "longitude": 0.0,
            "notificationToken": "null"
        };

        dataAccess.save(USER_TABLE, userItems, function (data) {
            var businessId = uuid.v1();
            var businessItems = {
                "businessId" : businessId,
                "businessName" : eventBody.business_name,
                "businessAddress" : eventBody.business_address,
                "businessLatitude" : eventBody.business_latitude,
                "businessLongitude" : eventBody.business_longitude,
                "businessUserId" : userId
            };

            dataAccess.save(BUSINESS_TABLE, businessItems, function (data) {
                callback(null, businessId);
            });
        });
    });
}

exports.getPromotions = function(event, context, callback) {
    var eventQuery = event.query ? event.query : event;

    dataAccess.filter(PROMOTION_TABLE, "promotionBusinessId", eventQuery.businessId, function(data) {
        var promotions = data;
        async.eachSeries(promotions, function (promotion, seriesCallback) {
            dataAccess.filter(PROMOTION_INSTANCE_TABLE, "promotionId", promotion.promotionId, function(promotionInstanceData) {
                var timeLeft = null;
                for (var i=0; i<promotionInstanceData.length; i++) {
                    var promotionStartDateTime = moment(promotionInstanceData[i].started, "YYYYMMDDHHmm");
                    promotionStartDateTime = promotionStartDateTime.add(2,"hours");

                    var minuteDifference = promotionStartDateTime.diff(moment(), 'minutes');
                    if (promotionStartDateTime.diff(moment(), 'minutes') > 0) {
                        var hours = Math.floor(minuteDifference / 60);
                        var minutes = minuteDifference - (hours*60);

                        var newTime = moment();
                        newTime.set('hour', hours);
                        newTime.set('minute', minutes);
                        timeLeft = newTime.format("HH:mm");
                    }

                }
                promotion["currentTimeLeft"] = timeLeft;

                seriesCallback();
            });

        }, function (err) {
            callback(null, promotions);
        });


        /*for (var i=0; i<promotions.length; i++) {
            promotions[i]["currentTimeLeft"] = null;
        }
        callback(null, promotions);*/
    });
}

exports.savePromotion = function(event, context, callback) {
    var eventBody = event.body ? event.body : event;

    var promotionId = uuid.v1();
    var items = {
        "promotionId" : promotionId,
        "promotionMessage": eventBody.promotion_message,
        "promotionNumberAvailable" : eventBody.promotion_number_available,
        "promotionMinimumUsers" : eventBody.promotion_minimum_users,
        "promotionBusinessId" : eventBody.promotion_business_id
    };

    dataAccess.save(PROMOTION_TABLE, items, function (data) {
        callback(null, promotionId);
    });
}

exports.savePromotionInstance = function(event, context, callback) {
    var eventBody = event.body ? event.body : event;

    var promotionInstanceId = uuid.v1();
    var items = {
        "promotionInstanceId" : promotionInstanceId,
        "promotionId": eventBody.promotionId,
        "numberClaimed" : 0,
        "started" : moment().format("YYYYMMDDHHmm")
    };

    dataAccess.save(PROMOTION_INSTANCE_TABLE, items, function (data) {
        callback(null, promotionInstanceId);
    });
}
'use strict';

// https://blogs.aws.amazon.com/javascript/post/Tx3BZ2DC4XARUGG/Support-for-Promises-in-the-SDK

var AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));
var dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

module.exports.save = (tableName, itemList, callback) => {
    var params = {
        TableName: tableName,
        Item: itemList
    };

    var put = docClient.put(params).promise();
    put.then(function(data) {
        callback(true);
    }).catch(function(err) {
        callback(false);
    });

};

module.exports.get = (tableName, callback) => {
    var params = { TableName : tableName };
    scan(params, function(data) {
          callback(data != null ? data : null);
    });
}

module.exports.filter = (tableName, filterName, filterValue, callback) => {
    var params = {
        TableName : tableName,
        FilterExpression: "#name = :value",
        ExpressionAttributeNames:{
            "#name": filterName
        },
        ExpressionAttributeValues: {
            ":value": filterValue
        }
    };

    scan(params, function(data) {
        callback(data != null ? data : null);
    });
}

// batch methods

module.exports.save_batch = (tableName, items, callback) => {
//function save_batch(tableName, items, callback) {
    var async = require('async');

    var params = {
        RequestItems : {}
    };

    var tableArray = [];
    var itemCycles = Math.ceil(items.length / 25);
    for (var i=0; i<itemCycles; i++) {
        var tempTableArray = [];
        for (var j=0; j<25; j++) {
            if (items.length <= (i*25)+j) {
                break;
            }

            tempTableArray.push({
                PutRequest : {
                    Item : items[(i*25)+j]
                }
            });
        }
        tableArray.push(tempTableArray);
    }

    async.eachSeries(tableArray, function(tableItem, callbackInner) {
        var params = {
            RequestItems : {}
        };
        params["RequestItems"][tableName] = tableItem;

        docClient.batchWrite(params, function (err, data) {
            if (err) {
                console.log(JSON.stringify(err, null, 2));
            }
            callbackInner();
        });

    }, function() {
        callback();
    });
}

// Delete all items

module.exports.delete_batch = (tableName, primaryKey, callback) => {
    var async = require('async');

    var params = {
        TableName : tableName
    };

    var all_data = [];
    var sub_data = [];
    docClient.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                if (sub_data.length == 25) {
                    all_data.push(sub_data);
                    sub_data = [];
                }
                var deleteReq = {
                    DeleteRequest : {
                        Key : {}
                    }
                };

                deleteReq["DeleteRequest"]["Key"][primaryKey] = item[primaryKey];
                sub_data.push(deleteReq);

            });

            if (sub_data.length > 0) {
                all_data.push(sub_data);
            }

            async.eachSeries(all_data, function(sub_data, callbackInner) {
                var params = {
                    RequestItems : {}
                };
                params["RequestItems"][tableName] = sub_data;

                docClient.batchWrite(params, function (err, data) {
                    console.log("Deleting items");
                    callbackInner();
                });
            }, function() {
                console.log('Deleting items complete');
                callback();
            });
        }
    });
}

// Private methods

function scan(params, callback) {
    docClient.scan(params, function(err, data) {
        if (err) {
            callback(null);
        } else {
            callback(data.Items);
        }
    });
}
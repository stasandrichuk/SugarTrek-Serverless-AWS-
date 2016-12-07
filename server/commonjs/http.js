module.exports.get = (url, callback) => {
//function get(url, callback) {
    var request = require('request');
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body);
        }
    })
}

var xml2js = require('xml2js');

module.exports.parse = (xmlValue, callback) => {
    var parser = new xml2js.Parser();
    parser.parseString(xmlValue, function (err, result) {
        callback(result);
    });
}

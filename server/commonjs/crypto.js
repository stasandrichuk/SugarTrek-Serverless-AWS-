// Don't do this though, your keys should most likely be stored in env variables
// and accessed via process.env.MY_SECRET_KEY
var key = '12465-erdfrt-56tfer-78uhgf';
var encryptor = require('simple-encryptor')(key);

module.exports.encrpyt = (text, callback) => {
    callback(encryptor.encrypt(text));
}

module.exports.decrypt = (text, callback) => {
    callback(encryptor.decrypt(text));
}
'use strict';

module.exports.charge = (stripeKey, amount, currency, source, description, callback) => {
    var stripe = require("stripe")(
        stripeKey
    );

    stripe.charges.create({
        amount: amount,
        currency: currency,
        source: source,
        description: description
    }, function(err, charge) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            callback(null, "");
        } else {
            callback(null, charge.id);
        }
    });
}

module.exports.createManagedAccount = (stripeKey, callback) => {
    var stripe = require("stripe")(
        stripeKey
    );


}

'use strict';

var checkVat = require('./vies-client.js').checkVat;

module.exports.handler = function(event, context, cb) {

  var countryCode = event.countryCode,
  	  vatNumber = event.vatNumber;

  if (!countryCode || !vatNumber) {
  	return cb(new Error('Request does not contain a valid country code or VAT number'), null);	
  }


  checkVat({countryCode: countryCode, vatNumber: vatNumber}, function (err, results) {
  	if (err) {
  		return cb(err, null);
  	}
  	return cb(null, results);	
  });	
};

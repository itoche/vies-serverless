var soap = require('soap'),
	url = 'http://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl',
	countries = require("i18n-iso-countries");

var client;

console.log('loading vies-server.js');


function isReady() {
	return !(client === undefined);
}

function callVies(vatObj, callback) {

	console.log('About the call VIES for ' + JSON.stringify(vatObj));

	var country = countries.getName(vatObj.countryCode, 'en');

	if (!country) {
		callback(new Error(vatObj.countryCode + ' is not a valid country code'));
	}	

	soap.createClient(url, function(err, soapClient) {
		if (err) {
			console.error('Could not create SOAP client for ' + url);
			throw err;
		}
		client = soapClient;
			client.checkVat(vatObj, function(err, result) {
	      console.log(result);
		  callback(err, result);
	    });
	});
}

function checkVat(vatObject, callback) {
	callVies(vatObject, function (err, results) {
		if (err) {
			callback(err, null);
		}

		var r = formatResuls(results);

		callback(err, r);
	});
}

function formatResuls(results) {

	var country = countries.getName(results.countryCode, 'en');
	var holder;

	if (results.valid) {
		holder = {
			name : results.name,
			address: results.address,
			country: country
		}
	}

	return {
		vatPrefix: results.countryCode,
		vatNumber: results.vatNumber,
		fullVatNumber: results.countryCode + results.vatNumber,
		valid: results.valid,
		holder: holder

	}

}

exports.checkVat= checkVat;
/**
 * API Methods to fetch data from Servant
 */

// Dependencies
var request = require('request'),
	querystring = require('querystring');


/**
 *  Function to Create API Methods from methods.json
 */

var _createMethod = function(http_method, uri, param_types) {

	return function(params, callback) {

		if (!params || !params.access_token) return callback(new Error("Servant SDK Error – No access_token provided in the parameters"));

		_callAPI(
			http_method, // HTTP method
			uri, // URI
			param_types, // parameter types
			params, // parameters
			params.access_token, // OAuth access token and secret
			callback
		); // callback for call completion

	};
};


/**
 *  Parses URI and separates Params and other useful things
 */

var _formatURI = function(uri, params) {
	var uri_builder = [this._call_base];
	var idx = 0,
		cidx = 0;

	do {
		// search for a URI param marker
		cidx = uri.indexOf(':', idx);

		// couldn't find any more URI parameters
		if (cidx == -1) {
			// append the rest of the URI; we're done
			uri_builder.push(uri.substr(idx));
			break;
		}

		// append URI part between the last known delimiter and param
		uri_builder.push(uri.substring(idx, cidx));

		// find next delimiter
		idx = uri.indexOf('/', cidx);

		if (idx == -1) // no more delimiters; we're done
		{
			param_name = uri.substr(cidx + 1);
		} else {
			param_name = uri.substring(cidx + 1, idx);
		}

		if (param_name in params) {
			uri_builder.push(querystring.escape(params[param_name]));
			delete params[param_name];
		} else {
			throw new Error('missing required parameter "' +
				param_name + '" in request parameters');
		}
	} while (idx != -1);

	return uri_builder.join('');
};



/**
 *  Make API calls to Servant Resources
 */

var _callAPI = function(http_method, uri, param_types, params, access_token, callback) {

	var new_params = {},
		param_name;

	for (param_name in params) {
		if (params.hasOwnProperty(param_name)) {

			if (!(param_name in param_types)) {
				return callback(new TypeError('Servant SDK Error – "' + param_name +
					'" is not a valid parameter for this request'));
			}

			if (params[param_name] instanceof Array) {
				new_params[param_name] = params[param_name].join(',');
			} else {
				new_params[param_name] = params[param_name];
			}
		}
	}

	var headers = {},
		request_url = '';

	try {
		request_url = _formatURI(uri, new_params);
	} catch (e) {
		return callback(e);
	}

	if (http_method == 'GET') {
		request_url += '?' + querystring.stringify(new_params);
		headers['Content-Length'] = 0;
	}

	// Perform API Request
	var options = {
		method: http_method
	};
	options.url = 'http://api0.servant.co';
	options.url = options.url + request_url;

	request(options, function(error, response, body) {
		if (error) return callback(error, null);
		if (response.statusCode !== 200) return callback(JSON.parse(body), null);
		if (response.statusCode == 200) return callback(null, JSON.parse(body));
	});
};


/** 
 * Load all API methods in methods.json for accessing Servant's API Resources
 */

var MethodTable = (JSON.parse(require('fs').readFileSync(__dirname + '/methods.json'))).results;

for (var i = 0; i < MethodTable.length; ++i) {
	var method = MethodTable[i];

	module.exports[method.name] = _createMethod(
		method.http_method,
		method.uri,
		method.params
	);

};


// // End
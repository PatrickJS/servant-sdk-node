var http = require('http'),
	querystring = require('querystring'),
	MethodTable = (JSON.parse(require('fs').readFileSync(__dirname + '/methods.json'))).results;


// Servant Constructor
var Servant = function(client_id, client_secret, redirect_url, api_version) {

	// Check for required parameters
	if (!client_id || !client_secret || !redirect_url || !api_version) {
		throw new Error("Servant SDK Error – Please include all of the required parameters: client_id, client_secret, redirect_url, api_version");
	}

	// Defaults
	this._redirect_url = redirect_url;
	this._client_id = client_id;
	this._client_secret = client_secret;
	this._api_version = api_version;
	this._servant_url = process.env.NODE_ENV === 'servant_development' ? 'lvh.me' : 'www.servant.co';
	this._version = '0.0.1';

	// Warn if using with a local copy of Servant
	if (process.env.NODE_ENV === 'servant_development') console.log(" ****** You Are Using Boilerplate With A Local Copy Of Servant ****** ")

	// Load all API methods in methods.json for accessing Servant's API Resources
	if (!this._methodsLoaded) {
		for (var i = 0; i < MethodTable.length; ++i) {
			var method = MethodTable[i];

			Servant.prototype[method.name] = Servant.prototype._createMethod(
				method.http_method,
				method.url,
				method.params
			);
		}
		this._methodsLoaded = true;
	}
	this._methodsLoaded = false;

}; // Instantiate Servant Constructor


Servant.prototype.getAccessToken = function(req, callback) {
	// If 'authorized' param is available, the user has already authorized access to this client
	if (req.query.authorized && req.query.authorized == 'true') return callback(null, req.query);

	// Convert the Request Token/Authorization Code into an Access Token
	var options = {
		hostname: this._servant_url,
		path: '/connect/v0/oauth2/token?grant_type=authorization_code&client_id=' + this._client_id + '&client_secret=' + this._client_secret + '&redirect_url=' + this._redirect_url + '&code=' + req.query.code,
		headers: {
			accept: 'application/json'
		}
	};

	if (process.env.NODE_ENV === 'servant_development') options.port = 4000;

	var request = http.get(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(data) {
			// If Error 
			if (res.statusCode !== 200) return callback(JSON.parse(data), null);
			// Return Access & Client Tokens
			return callback(null, JSON.parse(data));
		});
	});

	request.on('error', function(e) {
		callback(e, null);
	});

	request.end();

};


// Create An API Method for each Method listed in Methods.json
Servant.prototype._createMethod = function(http_method, uri, param_types) {

	return function(params, callback) {

		if (!params || !params.token) return callback(new Error("Servant SDK Error – No token provided in the parameters"));

		this._callAPI(
			http_method, // HTTP method
			uri, // URI
			param_types, // parameter types
			params, // parameters
			params.token, // OAuth access token and secret
			callback); // callback for call completion
	};
};


// Parses URI and separates Params and other useful things
Servant.prototype._formatURI = function(uri, params) {
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



// Makes API calls to Servant's resrouces
Servant.prototype._callAPI = function(http_method, uri, param_types, params, token, callback) {

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

	var headers = {
		'Connection': 'Keep-Alive',
		'Host': 'www.servant.co',
		'Content-Type': 'application/json',
		'User-Agent': 'Servant Node SDK ' + this._version
	};

	var request_url = '';

	try {
		request_url = this._formatURI(uri, new_params);
	} catch (e) {
		return callback(e);
	}

	if (http_method == 'GET') {
		request_url += '?' + querystring.stringify(new_params);
		headers['Content-Length'] = 0;
	}

	var request;

	var options = {
		host: 'www.servant.co',
		port: 80,
		path: request_url,
		method: http_method,
		headers: headers
	};

	var req = http.request(options, function(response) {

		response.setEncoding('utf8');
		var body = '';
		var err = null;

		switch (response.statusCode) {
			case 200:
			case 201:
				response.on('data', function(chunk) {
					body += chunk;
				});
				response.on('end', function() {
					var response = JSON.parse(body)
					callback(null, response);
				});
				return;

			case 400:
				err = new Error('Servant SDK Error – API call request is malformatted');
				break;

			case 401:
				err = new Error('Servant SDK Error – API call request is unauthorized');
				break;

			case 403:
				err = new Error('Servant SDK Error – Requested resource is not available');
				break;

			case 404:
				err = new Error('Servant SDK Error – Requested resource could not be found');
				break;

			case 409:
				err = new Error('Servant SDK Error – Requested resource is currently locked and cannot be modified');
				break;

			case 500:
				err = new Error('Servant SDK Error – An error occurred in Servant API while processing the request');
				break;

			case 504:
				err = new Error('Servant SDK Error – The API timed out while processing the request');
				break;
		}

		if (!err) {
			err = new Error('API call failed due to unknown error');
		}

		err.statusCode = response.statusCode;
		err.errorCode = response.headers['x-mashery-error-code'] || null;
		err.url = request_url;
		callback(err);

	});

	req.on('error', function(e) {
		console.log('Servant SDK Error', e);
	});

	req.end();

};

module.exports = function(client_id, client_secret, redirect_uri, api_version) {
	return new Servant(client_id, client_secret, redirect_uri, api_version);
};
var http = require('http'),
	querystring = require('querystring'),
	MethodTable = (JSON.parse(require('fs').readFileSync(__dirname + '/methods.json'))).results;


// INSPIRATION ---- https://github.com/Muon/node-etsy


// Create Servant Class-based Object
function Servant(client_id, client_secret, redirect_uri, api_version) {

	if (!client_id, !client_secret, !redirect_uri, !api_version) throw new Error("Servant SDK Error – Please include all of the required parameters: client_id, client_secret, redirect_uri, api_version");

	// Set Defaults
	this._api_key = client_id;
	var base_url = '/connect/' + api_version + '/oauth2/';

	// Create Oauth2 
	var OAuth2 = require('simple-oauth2')({
		clientID: client_id,
		clientSecret: client_secret,
		authorizationPath: base_url + 'authorize',
		tokenPath: base_url + 'token',
		site: 'http://www.servant.co'
	});
	// Servant Authentication Methods
	this.authorization_uri = OAuth2.AuthCode.authorizeURL({
		redirect_uri: redirect_uri
	});

	this.getAccessToken = function(req, callback) {
		// Check to see if 'authenticated' param is available, this means the user has already authenticated
		if (req.query.authenticated && req.query.authenticated == 'true') {
			return callback(null, req.query);
		} else {
			// Convert the Request Code/Token into an Access Token
			var code = req.query.code
			var token;
			OAuth2.AuthCode.getToken({
				code: code,
				redirect_uri: redirect_uri
			}, saveToken);
		};
		// Save the access token
		function saveToken(error, result) {
			if (error) {
				console.log('Servant SDK Error – Access Token Error: ', error);
				if (callback) callback(error, null);
			};
			// Create Refresh And Other Function Options
			// token = OAuth2.AccessToken.create(result);
			if (callback) callback(null, result);
		};
	};

	if (!Servant.prototype.methodsLoaded) {
		for (var i = 0; i < MethodTable.length; ++i) {
			var method = MethodTable[i];

			Servant.prototype[method.name] = Servant.prototype._createMethod(
				method.http_method,
				method.uri,
				method.visibility,
				method.params
			);
		}

		Servant.prototype.methodsLoaded = true;
	}
}

Servant.prototype.methodsLoaded = false;

// Creates An API Method for each Method listed in Methods.json
Servant.prototype._createMethod = function(http_method, uri, visibility, param_types) {
	if (typeof http_method == 'undefined') {
		throw new Error('missing required argument http_method');
	}

	if (typeof uri == 'undefined') {
		throw new Error('missing required argument uri');
	}

	if (typeof visibility == 'undefined') {
		throw new Error('missing required argument visibility');
	}

	if (typeof param_types == 'undefined') {
		throw new Error('missing required argument param_types');
	}

	if (http_method != 'GET' && http_method != 'POST' && http_method != 'PUT' && http_method != 'DELETE') {
		throw new Error('invalid HTTP method "' + http_method + '"');
	}

	if (typeof uri != 'string') {
		throw new Error('URI is not a string');
	}

	if (visibility != 'public' && visibility != 'private') {
		throw new Error('method visibility is neither public nor private');
	}

	return function(params, callback) {

		// copy the visibility so it can be safely modified
		var vis = visibility;

		if (vis == 'public') {
			if (params.token) {
				// if a token is passed in, make the call private
				vis = 'private';
			}
		} else if (vis == 'private') {
			if (!params || !params.token) return callback(new Error("Servant SDK Error – No token provided in the parameters"));
		}

		this._callAPI(
			http_method, // HTTP method
			uri, // URI
			vis, // visibility
			param_types, // parameter types
			params, // parameters
			params.token, // OAuth access token and secret
			callback); // callback for call completion
	};
};

// Parses URI and separates Params and other useful things
Servant.prototype._formatURI = function(uri, visibility, params) {
	var uri_builder = [this._call_base, '/', visibility];
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

// Calls the API's resources
Servant.prototype._callAPI = function(http_method, uri, visibility, param_types, params, token, callback) {
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

	if (token === null) {
		new_params.api_key = this._api_key;
	}

	var headers = {
		'Connection': 'Keep-Alive',
		'Host': 'www.servant.co'
	};

	var request_url = '';

	try {
		request_url = this._formatURI(uri, visibility, new_params);
	} catch (e) {
		return callback(e);
	}

	if (http_method == 'GET') {
		request_url += '?' + querystring.stringify(new_params);
		headers['Content-Length'] = 0;
	}

	var request;

	if (token === null) {
		request = http.Client.prototype.request.call(
			this._client,
			http_method,
			request_url,
			headers
		);

		request.end(http_method == 'GET' ? null : querystring.stringify(new_params));
	} else {
		this._signature.token = token;

		request = this._client.request(
			http_method,
			request_url,
			headers,
			http_method == 'GET' ? null : new_params,
			this._signature
		);
		request.end();

		this._signature.token = null;
	}

	request.on('response', function(response) {
		response.setEncoding('utf8');
		var data = '';
		var err = null;

		switch (response.statusCode) {
			case 200:
			case 201:
				response.on('data', function(chunk) {
					data += chunk;
				});
				response.on('end', function() {
					callback(null, JSON.parse(data));
				});
				return;

			case 400:
				err = new Error('API call request is malformatted');
				break;

			case 401:
				err = new Error('API call request is unauthorized');
				break;

			case 403:
				err = new Error('requested resource is not available');
				break;

			case 404:
				err = new Error('requested resource could not be found');
				break;

			case 409:
				err = new Error('requested resource is currently locked and cannot be modified');
				break;

			case 500:
				err = new Error('an error occurred in Servant API while processing the request');
				break;

			case 504:
				err = new Error('the API timed out while processing the request');
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
};

exports.Servant = Servant;
/**
 * Authorization Methods to authorize Apps with Servant
 */


module.exports.exchangeAuthCode = function(req, callback) {
	// Check if User is authorized or not by which params have been received
	if (typeof req.query.code !== 'undefined') {
		// User is UNAUTHORIZED, Fetch Refresh Token
		// Check if SDK is being used to test with a local version of Servant
		var servant_host = process.env.NODE_ENV === 'servant_development' ? 'localhost:4000' : 'www.servant.co';
		// Set Headers
		var headers = {
			'Connection': 'Keep-Alive',
			'Host': servant_host,
			'Content-Type': 'application/json',
			'User-Agent': 'Servant Node SDK ' + this._version
		};
		// Set Options for Request back to Servant
		var options = {
			method: 'GET',
			headers: headers
		};
		options.url = process.env.NODE_ENV === 'servant_development' ? 'http://localhost:4000' : 'http://www.servant.co';
		options.url = options.url + '/connect/v0/oauth2/token?grant_type=authorization_code&client_id=' + this._client_id + '&client_secret=' + this._client_secret + '&redirect_url=' + this._redirect_url + '&code=' + req.query.code;
		// Make Request to exchange AuthCode for AccessToken & Refresh Token
		request(options, function(error, response, body) {
			if (error) return callback(error, null);
			if (response.statusCode !== 200) return callback(JSON.parse(body), null);
			if (response.statusCode == 200) return callback(null, JSON.parse(body));
		});
	} else if (typeof req.query.access_token !== 'undefined') {
		// User is AUTHORIZED, Pass On Access Token
		return callback(null, req.query);
	} else {
		throw new Error('Something has gone wrong with the authorization process.  Make sure the Connect URL is correct and it contains a response_type=code parameter.');
	} // if req.query.code == Check type of response
}; // exchangeAuthCode



module.exports.refreshAccessToken = function(refresh_token, callback) {
	// Check if SDK is being used to test with a local version of Servant
	var servant_host = process.env.NODE_ENV === 'servant_development' ? 'localhost:4000' : 'www.servant.co';
	// Set Headers
	var headers = {
		'Connection': 'Keep-Alive',
		'Host': servant_host,
		'Content-Type': 'application/json',
		'User-Agent': 'Servant Node SDK ' + this._version
	};
	// Set Options for Request back to Servant
	var options = {
		method: 'GET',
		headers: headers
	};
	options.url = process.env.NODE_ENV === 'servant_development' ? 'http://localhost:4000' : 'http://www.servant.co';
	options.url = options.url + '/connect/v0/oauth2/refresh?grant_type=refresh_token&client_id=' + this._client_id + '&client_secret=' + this._client_secret + '&refresh_token=' + refresh_token;
	// Make Request to exchange AuthCode for AccessToken & Refresh Token
	request(options, function(error, response, body) {
		if (error) return callback(error, null);
		if (response.statusCode !== 200) return callback(JSON.parse(body), null);
		if (response.statusCode == 200) return callback(null, JSON.parse(body));
	});

}; // refreshAccessToken 

// End
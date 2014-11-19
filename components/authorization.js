/**
 * Authorization Methods to authorize Apps with Servant
 */

// Dependencies
var unirest = require('unirest');


/**
 *  Exchange AuthorizationCode for AccessToken
 */
module.exports.exchangeAuthCode = function(ServantDefaults, authorization_code, callback) {
    // Check if User is authorized or not by which params have been received
    if (authorization_code) {
        // User is UNAUTHORIZED, Fetch Refresh Token
        // Set Headers
        var headers = {
            'Connection': 'Keep-Alive',
            'Host': 'www.servant.co',
            'Accept': 'application/json',
            'User-Agent': 'Servant Node SDK ' + ServantDefaults._sdk_version
        };
        // Set Data
        var data = JSON.stringify({
            grant_type: 'authoriation_code',
            authorization_code: authorization_code,
            client_id: ServantDefaults._client_id,
            client_secret: ServantDefaults._client_secret,
        });
        var url = 'https://api0.servant.co/connect/oauth2/exchange_auth_code?grant_type=authorization_code&client_id=' + ServantDefaults._client_id + '&client_secret=' + ServantDefaults._client_secret + '&redirect_url=' + ServantDefaults._redirect_url + '&authorization_code=' + authorization_code;
        // Make Request to exchange AuthCode for AccessToken & Refresh Token
        unirest.post(url).headers(headers).send(data).end(function(response) {
            console.log(response);
            // if (error) return callback(error, null);
            // if (response.statusCode !== 200) return callback(JSON.parse(body), null);
            // if (response.statusCode == 200) return callback(null, JSON.parse(body));
        });
    } else {
        throw new Error('Something has gone wrong with the authorization process.  Make sure the Connect URL is correct and it contains a response_type=code parameter.');
    } // if req.query.code == Check type of response
}; // exchangeAuthCode



/**
 *  Refresh AccessToken via RefreshToken
 */
module.exports.refreshAccessToken = function(ServantDefaults, refresh_token, callback) {
    // Set Headers
    var headers = {
        'Connection': 'Keep-Alive',
        'Host': 'www.servant.co',
        'Content-Type': 'application/json',
        'User-Agent': 'Servant Node SDK ' + ServantDefaults._sdk_version
    };
    // Set Options for Request back to Servant
    var options = {
        method: 'GET',
        headers: headers
    };
    options.url = 'https://api0.servant.co/connect/oauth2/refresh?grant_type=refresh_token&client_id=' + ServantDefaults._client_id + '&client_secret=' + ServantDefaults._client_secret + '&refresh_token=' + refresh_token;
    // Make Request to exchange AuthCode for AccessToken & Refresh Token
    request(options, function(error, response, body) {
        if (error) return callback(error, null);
        if (response.statusCode !== 200) return callback(JSON.parse(body), null);
        if (response.statusCode == 200) return callback(null, JSON.parse(body));
    });
}; // refreshAccessToken 


// End
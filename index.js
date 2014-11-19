/**
 *  Servant SDK for Node.js - https://github.com/servant-cmes/servant-sdk-node
 *  Servant - https://www.servant.co
 *  Documentation – https://developers.servant.co/documentation
 *  By Austen Collins
 */

var request = require('request');

var authorization = require('./components/authorization.js');
var archetypes = require('./components/archetypes.js');

/**
 * Servant Constructor
 */

function Servant(client_id, client_secret, protocol, api_version) {

    // Check for required parameters
    if (!client_id || !client_secret) {
        throw new Error("Servant SDK Error – Please include all of the required parameters: client_id, client_secret");
    }

    // Defaults
    this._client_id = client_id;
    this._client_secret = client_secret;
    this._api_version = api_version || 0;
    this._sdk_version = '0.0.1';
    this._protocol = protocol || 'http';
    this._path = this._protocol + '://api0.servant.co';

    // Internal Functions
    this._callAPI = function(access_token, url, body, method, headers, query_string, timeout, callback) {
        // Set Options
        var options = {};
        // Set Headers
        if (!headers) {
            options.headers = {
                'Connection': 'Keep-Alive',
                'Host': 'api0.servant.co',
                'Content-Type': 'application/json',
                'User-Agent': 'Servant Node SDK ' + this._sdk_version
            }
        }
        // Set URL, AccessToken, Query Params
        if (!access_token) throw new Error("Servant SDK Error – Please include an access_token");
        options.url = this._path + url + '?access_token=' + access_token;
        if (query_string) options.url = options.url + query_string;
        // Set Timeout
        if (!timeout) options.timeout = 4000;
        // Set Method, Body
        options.method = method;
        options.json = true;
        if (options.method === 'POST' || options.method === 'PUT') {
            if (typeof body !== 'string') {
                options.body = JSON.stringify(body);
            } else {
                options.body = body
            }
        }
        // Perform API Requests
        request(options, function(error, response, body) {
            if (error) return callback(error, null);
            if (response.statusCode !== 200) return callback(body, null);
            if (response.statusCode == 200) return callback(null, body);
        });
    };

}; // Instantiate Servant Constructor


/**
 * Methods: Archetypes
 */

Servant.prototype.archetypes = require('json-archetypes').archetypes;

Servant.prototype.new = function(archetype) {
    return archetypes.instantiate(archetype);
};

Servant.prototype.validate = function(archetype, instance, callback) {
    return archetypes.validate(this, archetype, instance, callback);
};

/**
 * Methods: Authorization
 */

Servant.prototype.exchangeAuthCode = function(authorization_code, callback) {
    return authorization.exchangeAuthCode(this, authorization_code, callback);
};

Servant.prototype.refreshAccessToken = function(refresh_token, callback) {
    return authorization.refreshAccessToken(this, refresh_token, callback);
};

/**
 * Methods: API
 */

Servant.prototype.getUserAndServants = function(access_token, callback) {
    this._callAPI(
        access_token, // access_token
        '/data/servants', // url
        null, // body
        'GET', // method
        null, // headers
        null, // query_string
        null, // timeout
        function(error, response) {
            if (error) return callback(error, null);
            return callback(null, response);
        } // callback
    );
};

/**
 * Export the SDK
 */
module.exports = function(client_id, client_secret, redirect_uri, api_version) {
    return new Servant(client_id, client_secret, redirect_uri, api_version);
};



// The End
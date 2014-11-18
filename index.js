/**
 *  Servant SDK for Node.js - https://github.com/servant-cmes/servant-sdk-node
 *  Servant - https://www.servant.co
 *  Documentation – https://developers.servant.co/documentation
 *  By Austen Collins
 */

var authorization = require('./components/authorization.js');
var api_methods = require('./components/api_methods.js');
var archetypes = require('./components/archetypes.js');


/**
 * Servant Constructor
 */

function Servant(client_id, client_secret, api_version) {

    // Check for required parameters
    if (!client_id || !client_secret) {
        throw new Error("Servant SDK Error – Please include all of the required parameters: client_id, client_secret");
    }

    // Defaults
    this._client_id = client_id;
    this._client_secret = client_secret;
    this._api_version = api_version || 0;
    this._sdk_version = '0.0.1';

}; // Instantiate Servant Constructor



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

Servant.prototype.getServants = function(params, callback) {
    return api_methods.getServants(params, callback);
};



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
 * Export the SDK
 */
module.exports = function(client_id, client_secret, redirect_uri, api_version) {
    return new Servant(client_id, client_secret, redirect_uri, api_version);
};



// The End
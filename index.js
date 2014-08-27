/**
 *  Servant SDK for Node.js - https://github.com/servant-cmes/servant-sdk-node
 *  Servant - http://servant.co
 *  By Austen Collins
 */


/**
 * Options Object to share data
 */

var ServantDefaults = {};



/**
 * SERVANT CONSTRUCTOR ----------
 */

var Servant = function(client_id, client_secret, redirect_url, api_version) {

	// Check for required parameters
	if (!client_id || !client_secret || !redirect_url || typeof api_version === 'undefined') {
		throw new Error("Servant SDK Error – Please include all of the required parameters: client_id, client_secret, redirect_url, api_version.  Here is what you entered in order: ", client_id, client_secret, redirect_url, api_version);
	}

	// Add In Options
	ServantDefaults._redirect_url = redirect_url;
	ServantDefaults._client_id = client_id;
	ServantDefaults._client_secret = client_secret;
	ServantDefaults._api_version = api_version;
	ServantDefaults._version = '0.0.1';

	// Warn if using with a local copy of Servant
	if (process.env.NODE_ENV === 'servant_development') console.log(" ****** You Are Using Boilerplate With A Local Copy Of Servant ****** ")

}; // Instantiate Servant Constructor



/**
 * AUTHORIZATION METHODS ----------
 */

var authorization = require('./components/authorization.js'); 

Servant.prototype.exchangeAuthCode = function(req, callback) {
	return authorization.exchangeAuthCode(ServantDefaults, req, callback);
};

Servant.prototype.refreshAccessToken = function(refresh_token, callback) {
	return authorization.refreshAccessToken(ServantDefaults, refresh_token, callback);
};



/**
 * API METHODS ----------
 */

var api_methods = require('./components/api_methods.js'); 

Servant.prototype.getUser = function(params, callback) {
	return api_methods.getUser(params, callback);
};



/**
 * ARCHETYPE METHODS ----------
 */

var archetypes = require('./components/archetypes.js'); 

Servant.prototype.new = function(archetype) {
	return archetypes.instantiate(archetype);
};

Servant.prototype.validate = function(archetype, instance, callback) {
	return archetypes.validate(ServantDefaults, archetype, instance, callback);
};



/**
 * EXPORT SDK ----------
 */

module.exports = function(client_id, client_secret, redirect_uri, api_version) {
	return new Servant(client_id, client_secret, redirect_uri, api_version);
};




// The End
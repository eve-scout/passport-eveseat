'use strict';

/**
 * Module dependencies.
 */
var util = require('util'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
    InternalOAuthError = require('passport-oauth').InternalOAuthError;

/**
 * `Strategy` constructor.
 *
 * The EVE SeAT authentication strategy authenticates requests by delegating to
 * EVE SeAT using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your SeAT application's app key found in the App Console
 *   - `clientSecret`  your SeAT application's app secret
 *   - `baseURI`       URI to which SeAT is hosted
 *   - `callbackURL`   URL to which SeAT will redirect the user after granting authorization
 *   - `scope`         Scopes to grant access to. Optional, but should be set to `character.profile,character.roles,email`
 *
 * Examples:
 *
 *     passport.use(new EveSeatStrategy({
 *         clientID: 'yourAppKey',
 *         clientSecret: 'yourAppSecret'
 *         baseURI: 'https://www.example.net',
 *         callbackURL: 'https://www.example.net/oauth2/callback',
 *         scope: 'character.profile,character.roles,email'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};

  if (!options.baseURI) {
    throw new TypeError('EveSeatStrategy requires a baseURI option');
  }

  // Remove trailing slash if provided
  options.baseURI = options.baseURI.replace(/\/$/, '');

  options.authorizationURL = options.baseURI + '/oauth2/authorize';
  options.tokenURL = options.baseURI + '/oauth2/token';

  this._userProfileURL = options.baseURI + '/oauth2/profile';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'eveseat';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from EVE SeAT.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`           always set to `eveseat`
 *   - `email`              the users's email address
 *   - `accountCreateDate`  the users's account created date
 *   - `accountActive`      the users's account status
 *   - `characterID`        the characters's Character ID
 *   - `characterName`      the characters's Character Name
 *   - `characterPortrait`  the characters's Portrait URL
 *   - `corporationID`      the characters's Corporation ID
 *   - `corporationName`    the characters's Corporation Name
 *   - `allianceID`         the characters's Alliance ID
 *   - `allianceName`       the characters's Alliance Name
 *   - `allianceTicker`     the characters's Alliance Ticker
 *   - `roles`              SeAT roles associated with this user and/or character
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body) {
    if(err) {
      return done(new InternalOAuthError('Failed to parse user profile.', err));
    }

    var json;
    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile.'));
    }

    var profile = {
      'provider': 'eveseat',
      'accountCreateDate': Date.parse(json.accountCreateDate),
      'accountActive': json.accountActive,
      'email': json.email,
      'characterID': json.characterID,
      'characterName': json.characterName,
      'characterPortrait': json.characterPortrait,
      'corporationID': json.corporationID,
      'corporationName': json.corporationName,
      'allianceID': json.allianceID,
      'allianceName': json.allianceName,
      'allianceTicker': json.allianceTicker,
      'roles': json.roles
    };

    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
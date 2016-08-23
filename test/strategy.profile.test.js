/* global describe, it, before, expect */
/* jshint expr: true */

var EveSeatStrategy = require('../lib/strategy'),
    InternalOAuthError = require('passport-oauth2').InternalOAuthError;


describe('Strategy#userProfile', function() {

  describe('fetched from default endpoint', function() {
    var strategy = new EveSeatStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        baseURI: 'https://www.example.com',
        callbackURL: 'https://www.example.com/oath/callback'
      }, function() {});

    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'https://www.example.com/oauth2/profile') { return callback(new Error('incorrect url argument')); }
      if (accessToken != 'token') { return callback(new Error('incorrect token argument')); }
      var body = {
          'email'             : 'johnnysplunk@eve-scout.com',
          'accountCreateDate' : '2014-09-24T09:49:45+0000',
          'accountActive'     : true,
          'characterID'       : 95158478,
          'characterName'     : 'Johnny Splunk',
          'characterPortrait' : '//image.eveonline.com/Character/95158478_256.jpg',
          'corporationID'     : 98361601,
          'corporationName'   : 'EvE-Scout',
          'allianceID'        : 99005130,
          'allianceName'      : 'EvE-Scout Enclave',
          'allianceTicker'    : '5COUT',
          'roles' : [
             'auth:forum:admin'
          ]
        };
      callback(null, JSON.stringify(body), undefined);
    };


    var profile;

    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.provider).to.equal('eveseat');
      expect(profile.accountCreateDate).to.equal(Date.parse('2014-09-24T09:49:45+0000'));
      expect(profile.email).to.equal('johnnysplunk@eve-scout.com');
      expect(profile.accountActive).to.equal(true);
      expect(profile.characterID).to.equal(95158478);
      expect(profile.characterName).to.equal('Johnny Splunk');
      expect(profile.characterPortrait).to.equal('//image.eveonline.com/Character/95158478_256.jpg');
      expect(profile.corporationID).to.equal(98361601);
      expect(profile.corporationName).to.equal('EvE-Scout');
      expect(profile.allianceID).to.equal(99005130);
      expect(profile.allianceName).to.equal('EvE-Scout Enclave');
      expect(profile.allianceTicker).to.equal('5COUT');
    });

    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });

    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  }); // fetched from default endpoint

  describe('fetched from default endpoint without alliance', function() {
    var strategy = new EveSeatStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        baseURI: 'https://www.example.com',
        callbackURL: 'https://www.example.com/oath/callback'
      }, function() {});

    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'https://www.example.com/oauth2/profile') { return callback(new Error('incorrect url argument')); }
      if (accessToken != 'token') { return callback(new Error('incorrect token argument')); }
      var body = {
          'email'             : 'johnnysplunk@eve-scout.com',
          'accountCreateDate' : '2014-09-24T09:49:45+0000',
          'accountActive'     : true,
          'characterID'       : 95158478,
          'characterName'     : 'Johnny Splunk',
          'characterPortrait' : '//image.eveonline.com/Character/95158478_256.jpg',
          'corporationID'     : 98361601,
          'corporationName'   : 'EvE-Scout',
          'allianceID'        : null,
          'allianceName'      : null,
          'allianceTicker'    : null,
          'roles' : [
             'auth:forum:admin'
          ]
        };
      callback(null, JSON.stringify(body), undefined);
    };


    var profile;
    
    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.provider).to.equal('eveseat');
      expect(profile.accountCreateDate).to.equal(Date.parse('2014-09-24T09:49:45+0000'));
      expect(profile.email).to.equal('johnnysplunk@eve-scout.com');
      expect(profile.accountActive).to.equal(true);
      expect(profile.characterID).to.equal(95158478);
      expect(profile.characterName).to.equal('Johnny Splunk');
      expect(profile.characterPortrait).to.equal('//image.eveonline.com/Character/95158478_256.jpg');
      expect(profile.corporationID).to.equal(98361601);
      expect(profile.corporationName).to.equal('EvE-Scout');
      expect(profile.allianceID).to.equal(null);
      expect(profile.allianceName).to.equal(null);
      expect(profile.allianceTicker).to.equal(null);
    });

    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });

    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  }); // fetched from default endpoint

  describe('error caused by malformed response', function() {
    var strategy =  new EveSeatStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        baseURI: 'https://www.example.com',
        callbackURL: 'https://www.example.com/oath/callback'
      }, function() {});

    strategy._oauth2.get = function(url, accessToken, callback) {
      var body = 'Hello, world.';
      callback(null, body, undefined);
    };


    var err, profile;

    before(function(done) {
      strategy.userProfile('token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('Failed to parse user profile');
    });
  }); // error caused by malformed response

  describe('error caused by error response', function() {
    var strategy =  new EveSeatStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        baseURI: 'https://www.example.com',
        callbackURL: 'https://www.example.com/oath/callback'
      }, function() {});

    strategy._oauth2.get = function(url, accessToken, callback) {
      var e = new InternalOAuthError("Failed to parse user profile");
      callback(e, undefined, undefined);
    };


    var err, profile;

    before(function(done) {
      strategy.userProfile('token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should error', function() {
      expect(err).to.be.an.instanceOf(InternalOAuthError);
      expect(err.message).to.equal('Failed to parse user profile');
    });
  }); // error caused by malformed response

});
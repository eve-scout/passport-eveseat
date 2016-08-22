/* global describe, it, expect, before */
/* jshint expr: true */

var EveSeatStrategy = require('../lib/strategy')
  , chai = require('chai');


describe('Strategy#authorization', function() {

  describe('with only a verify callback', function() {
    it('should throw', function() {
      expect(function() {
        new EveSeatStrategy(function() {});
      }).to.throw(TypeError, 'EveSeatStrategy requires a baseURI option');
    });
  }); // with only a verify callback

  describe('authorization request with standard baseURI', function() {
    var strategy = new EveSeatStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        baseURI: 'https://www.example.com',
        callbackURL: 'https://www.example.com/oath/callback'
    }, function() {});
    
    
    var url;
  
    before(function(done) {
      chai.passport.use(strategy)
        .redirect(function(u) {
          url = u;
          done();
        })
        .req(function(req) {
          req.session = {};
        })
        .authenticate();
    });
  
    it('should be redirected', function() {
      expect(url).to.equal('https://www.example.com/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Fwww.example.com%2Foath%2Fcallback&client_id=ABC123');
    });
  }); // authorization request with standard baseURI

  describe('authorization request with trailing slash baseURI', function() {
    var strategy = new EveSeatStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        baseURI: 'https://www.example.com/',
        callbackURL: 'https://www.example.com/oath/callback'
    }, function() {});
    
    
    var url;
  
    before(function(done) {
      chai.passport.use(strategy)
        .redirect(function(u) {
          url = u;
          done();
        })
        .req(function(req) {
          req.session = {};
        })
        .authenticate();
    });
  
    it('should be redirected', function() {
      expect(url).to.equal('https://www.example.com/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Fwww.example.com%2Foath%2Fcallback&client_id=ABC123');
    });
  }); // authorization request with standard baseURI

});
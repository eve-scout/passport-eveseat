/* global describe, it, expect, before */
/* jshint expr: true */

var EveSeatStrategy = require('../lib/strategy')
  , chai = require('chai');


describe('Strategy#constructed', function() {

  describe('with normal options', function() {
    var strategy = new EveSeatStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        baseURI: 'https://www.example.com',
        callbackURL: 'https://www.example.com/oath/callback'
      },
      function() {});
    
    it('should be named eveseat', function() {
      expect(strategy.name).to.equal('eveseat');
    });
  });

  describe('with undefined options', function() {
    it('should throw', function() {
      expect(function() {
        var strategy = new EveSeatStrategy(undefined, function(){});
      }).to.throw(Error);
    });
  }); // with undefined options

  describe('without baseURI', function() {
    it('should throw', function() {
      expect(function() {
        var strategy = new EveSeatStrategy({
          clientID: 'ABC123',
          clientSecret: 'secret',
          callbackURL: 'https://www.example.com/oath/callback'
        },
        function() {});
      }).to.throw(TypeError, 'EveSeatStrategy requires a baseURI option')
    });
  }); // without baseURI

  describe('with only a verify callback', function() {
    it('should throw', function() {
      expect(function() {
        new EveSeatStrategy(function() {});
      }).to.throw(TypeError, 'EveSeatStrategy requires a baseURI option');
    });
  }); // with only a verify callback

});
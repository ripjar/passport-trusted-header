"use strict";
/*globals describe,it,beforeEach*/

var Strategy = require("../").Strategy,
    helpers = require("./helpers");

require("chai").should();

describe("trusted headers strategy", function() {
  var strategy = new Strategy({ headers: ["something"] }, function() {});

  it("should be named trusted-header", function() {
    strategy.name.should.equal("trusted-header");
  });

  it("should require a verify function and a headers option", function() {
    (function() {
      new Strategy({});
    }).should.throw(Error);

    var f = function() {};
    (function() {
      new Strategy({}, f);
    }).should.throw(Error);

    new Strategy({ headers: ["something"] }, f);
  });

  describe("strategy authenticating a request", function() {
    var req,
        headers = { h1: "header one", h2: "header two", h3: "header three" },
        options = { headers: ["h1", "h2"] },
        failed,
        succeeded,
        passedToVerify;

    var fail = function() { failed = true; },
        success = function() { succeeded = true; },
        err = function() { throw new Error("should not be called"); };

    beforeEach(function() {
      strategy = new Strategy(options, function(cert) {
        passedToVerify = cert;
      });

      failed = false;
      succeeded = false;
      passedToVerify = null;

      strategy.fail = fail;
      strategy.success = success;
      strategy.error = err;
    });

    it("should fail if no headers are provided", function() {
      req = helpers.dummyReq(null, null, {});

      strategy.authenticate(req);
      failed.should.eq(true);
    });

    it("should fail if a subset of required headers are provided", function() {
      req = helpers.dummyReq(null, null, { h1: headers.h1 });

      strategy.authenticate(req);
      failed.should.eq(true);
    });

    it("should pass extracted headers to the verify callback", function() {
      req = helpers.dummyReq(null, null, headers);

      strategy.authenticate(req);
      passedToVerify.should.eql({ h1: headers.h1, h2: headers.h2 });
    });

    it("should succeed if the verify callback provided a user", function() {
      strategy = new Strategy(options, function(cert, done) {
        done(null, {});
      });

      strategy.fail = strategy.error = err;
      strategy.success = success;
      req = helpers.dummyReq(null, null, headers);

      strategy.authenticate(req);
      succeeded.should.eq(true);

    });

    it("should fail if the verify callback provided -false- instead of a user", function() {
      strategy = new Strategy(options, function(cert, done) {
        done(null, false);
      });

      strategy.fail = fail;
      strategy.success = strategy.error = err;

      req = helpers.dummyReq(null, null, headers);
      strategy.authenticate(req);

      failed.should.eq(true);
    });

    it("should error if the verify callback provided an error", function() {
      strategy = new Strategy(options, function(cert, done) {
        done(new Error("error from verify"));
      });

      var ok = false;
      strategy.error = function() { ok = true; };
      strategy.success = strategy.fail = err;

      req = helpers.dummyReq(null, null, headers);
      strategy.authenticate(req);

      ok.should.eq(true);
    });

  });

});

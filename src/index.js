"use strict";

var util = require("util"),
    BaseStrategy = require("passport-strategy");

var NAME = "trusted-header";

exports.Strategy = function TrustedHeadersStrategy(options, verify) {
  validateStrategyArgs(options, verify);

  BaseStrategy.call(this);
  this.name = NAME;
  this._verify = verify;
  this._headers = options.headers;
};

util.inherits(exports.Strategy, BaseStrategy);

function validateStrategyArgs(options, verify) {
  if(!verify) {
    throw new Error("Trusted headers strategy requires a verify function");
  }

  if(!options.headers) {
    throw new Error("Trusted headers strategy requires a headers option");
  }
}

exports.Strategy.prototype.authenticate = function authenticate(req) {
  var that = this,
      extractedHeaders = {};

  var foundHeaders = this._headers.every(function(h) {
    if(req.headers[h]) {
      extractedHeaders[h] = req.headers[h];
      return true;
    }
  });

  if(foundHeaders) {
    this._verify(extractedHeaders, function(err, user) {
      if (err) { return that.error(err); }
      if (!user) { return that.fail(); }
      that.success(user);
    });
  } else {
    this.fail();
  }
};

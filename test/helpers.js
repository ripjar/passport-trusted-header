"use strict";

exports.dummyReq = function(authorized, cert, headers) {
  return {
    client: {
      authorized: authorized
    },
    connection: {
      getPeerCertificate: function() {
        return cert;
      }
    },
    headers: headers
  };
};

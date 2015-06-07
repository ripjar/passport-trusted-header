# passport-trusted-header

[passport.js](http://passportjs.org/) strategy for authentication by a trusted HTTP header.

Node.js apps often have TLS handled by a front-end web server like [nginx](http://wiki.nginx.org/Main). For client cert authentication, the web server passes through certificate fields like [DN](http://httpd.apache.org/docs/2.2/ssl/ssl_intro.html#certificates) as HTTP headers. The Node app can use these headers for authentication.

This library helps to do this with [passport.js](http://passportjs.org/). If you have a Node.js app that accepts direct TLS connections, try [passport-client-cert](https://github.com/ripjar/passport-client-cert) instead.

## Security
The connection between web server and web app must be __secure__. The front-end web server must whitelist HTTP headers to send to the web app, and it must be impossible for external processes to reach the web app or interfere with connections between the web server and Node.js. It is __completely insecure__ if these conditions are not met!

## Usage
Create the strategy with an options object and a "verify request" callback.

### Options

 `headers` - required. Array of HTTP header names to extract. A request has to contain all of these headers to be authenticated.

The verify callback decides whether to authenticate each request. It called with the extracted header names/values and a [passport.js `done` callback](http://passportjs.org/guide/configure/).


````javascript
var passport = require('passport');
var Strategy = require('passport-trusted-headers').Strategy;

var options =  {
  headers: ['TLS_CLIENT_DN']
}

passport.use(new Strategy(options, function(requestHeaders, done) {
  var user = null;
  var userDn = requestHeaders.TLS_CLIENT_DN;

  // Authentication logic here!
  if(userDn === 'CN=test-cn') {
    user = { name: 'Test User' }
  }

  done(null, user);
}));
````

## Test

    $ npm install
    $ npm test

## Contibuting
Contributions are welcome! Please write unit tests, follow the existing coding style and lint with [eslint](http://eslint.org/).

## Authors

[Joe Whitfield-Seed](http://github.com/jwhitfieldseed)

## Licence

[The MIT Licence](http://opensource.org/licenses/MIT)
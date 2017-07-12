// TypeScript Version: 2.1

import { Strategy, StrategyOptions } from 'passport-trusted-header';

// $ExpectType any
const options: StrategyOptions =  {
  headers: ['TLS_CLIENT_DN']
};

// $ExpectType any
const strat = new Strategy(options, (requestHeaders, done) => {
  let user = null;
  const userDn = requestHeaders.TLS_CLIENT_DN;

  // Authentication logic here!
  if (userDn === 'CN=test-cn') {
    user = { name: 'Test User' };
  }

  done(null, user);
});

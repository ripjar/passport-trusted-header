// TypeScript Version: 2.1

import { Request } from 'express';

import passport = require('passport');

export interface RequestHeaders {
  // Field from README, user is free to define any header.
  'TLS_CLIENT_DN'?: string;
  [key: string]: any;
}

export interface StrategyOptions {
  headers: string[];
  passReqToCallback?: false;
}

export interface StrategyOptionsWithRequest {
  headers: string[];
  passReqToCallback: true;
}

export type VerifyCallback = (error: any, user?: any) => void;

export type VerifyFunctionWithRequest = (
  req: Request,
  requestHeaders: RequestHeaders,
  done: VerifyCallback
) => void;

export type VerifyFunction = (requestHeaders: RequestHeaders, done: VerifyCallback) => void;

export class Strategy implements Strategy {
  constructor(options: StrategyOptionsWithRequest, verify: VerifyFunctionWithRequest);
  constructor(options: StrategyOptions, verify: VerifyFunction);
  constructor(verify: VerifyFunction);

  name: string;
  authenticate: (req: Request, options?: any) => void;
}

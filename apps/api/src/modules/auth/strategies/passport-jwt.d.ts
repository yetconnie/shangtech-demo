declare module 'passport-jwt' {
  import { Strategy } from 'passport';
  
  export interface ExtractJwt {
    fromHeader(header_name: string): (req: any) => string | null;
    fromBodyField(field_name: string): (req: any) => string | null;
    fromUrlQueryParam(param_name: string): (req: any) => string | null;
    fromAuthHeaderWithScheme(scheme: string): (req: any) => string | null;
    fromAuthHeaderAsBearerToken(): (req: any) => string | null;
    fromExtract(extractor: (req: any) => string | null): (req: any) => string | null;
  }
  
  export const ExtractJwt: ExtractJwt;
  
  export interface JwtFromRequestFunction {
    (req: any): string | null;
  }
  
  export interface StrategyOptions {
    jwtFromRequest?: JwtFromRequestFunction;
    secretOrKey?: string | Buffer;
    secretOrKeyProvider?: (request: any, rawJwtToken: string, done: (err: any, secret: string | Buffer) => void) => void;
    issuer?: string | string[];
    audience?: string | string[];
    algorithms?: string[];
    ignoreExpiration?: boolean;
    passReqToCallback?: boolean;
    jsonWebTokenOptions?: any;
  }
  
  export interface VerifyCallback {
    (payload: any, done: (err: any, user: any, info?: any) => void): void;
  }
  
  export class Strategy extends passport.Strategy {
    constructor(options: StrategyOptions, verify: VerifyCallback);
    name: string;
  }
}
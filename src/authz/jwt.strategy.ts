import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const config = {
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}.well-known/jwks.json`,
        handleSigningKeyError: (err) => console.error(err), // do it better in real app!
      }),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //   audience: process.env.AUTH0_AUDIENCE,
      issuer: `${process.env.AUTH0_ISSUER_BASE_URL}`,
      algorithms: ["RS256"],
    };
    super(config);
  }

  async validate(payload: any) {
    console.log(    "😍😍😍😍😍😍😍😍😍😍😍   "+process.env.AUTH0_AUDIENCE    );
    
    const { aud, sub } = payload;
    console.log("in jj jj  "+ process.env.AUTH0_AUDIENCE);
    if (typeof aud !== "string" && aud.length > 0) {
      if (!aud.includes(process.env.AUTH0_AUDIENCE)) {
        throw new HttpException("Invalid audience.", HttpStatus.UNAUTHORIZED);
      }
    } else if (aud !== process.env.AUTH0_AUDIENCE) {
      throw new HttpException("Invalid audience.", HttpStatus.UNAUTHORIZED);
    }
    return { id: sub };
  }
}
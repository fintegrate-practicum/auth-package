import { HttpException, HttpStatus, Inject, Injectable, Provider } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";
import {UserService} from '../user/user.service'
// import {MODULE_OPTIONS_TOKEN} from './authz.module-definition'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  //private readonly  iUserService:IUserService
  constructor(private  userService:UserService){

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
    //console.log(this.userService);
    const { aud, sub } = payload;
    console.log('sub',sub)
    console.log('aud',aud)
    if (typeof aud !== "string" && aud.length > 0) {
      if (!aud.includes(process.env.AUTH0_AUDIENCE)) {
        throw new HttpException("Invalid audience.", HttpStatus.UNAUTHORIZED);
      }
    } else if (aud !== process.env.AUTH0_AUDIENCE) {
      throw new HttpException("Invalid audience.", HttpStatus.UNAUTHORIZED);
    }
    console.log('sub',sub)
    console.log('aud',aud)
    const user =await this.userService.getUserById(sub);
    console.log("user: ",user)
    console.log("sub: ",sub)
    console.log("id::::::",sub)
    if(user)
      return user
    return { id: sub};
  }
}
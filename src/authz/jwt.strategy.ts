import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";
import { HttpService } from "@nestjs/axios";
import { User } from "../user/user.type";
import { AxiosResponse } from "axios";
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  private readonly workersServiceUrl

  constructor(
    private readonly httpService: HttpService,
  ) {
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
    this.workersServiceUrl = process.env.VITE_DOCKER_WORKERS_SERVER_URL;
  }

  async validate(payload: any) {
    const { aud, sub } = payload;
    if (typeof aud !== "string" && aud.length > 0) {
      if (!aud.includes(process.env.AUTH0_AUDIENCE)) {
        throw new HttpException("Invalid audience.", HttpStatus.UNAUTHORIZED);
      }
    }
    else if (aud !== process.env.AUTH0_AUDIENCE) {
      throw new HttpException("Invalid audience.", HttpStatus.UNAUTHORIZED);
    }
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get<User>(`${this.workersServiceUrl}/user/${sub}`)
      );
      const user: User = response?.data.data;
      return user;
    }
    catch (error) {
      console.log("couldn't fetch user data ", error);
      return { id: sub }
    }
  }
}
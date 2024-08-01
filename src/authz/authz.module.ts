import { Module } from "@nestjs/common";
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { HttpModule } from "@nestjs/axios";

@Module({

  imports: [PassportModule.register({ defaultStrategy: "jwt" }), HttpModule],
  providers: [JwtStrategy],
  exports: [PassportModule],
})

export class AuthzModule{}
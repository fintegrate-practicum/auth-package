
import { Module } from "@nestjs/common";
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { UserService } from '../user/user.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" }), HttpModule],
  providers: [JwtStrategy, UserService],
  exports: [PassportModule],
})
export class AuthzModule {}

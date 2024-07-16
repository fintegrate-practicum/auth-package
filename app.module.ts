import { Module } from '@nestjs/common';
import { JwtStrategy } from './authz/jwt.strategy';

@Module({
  providers: [
    JwtStrategy,
  ],
  exports: [
    JwtStrategy,
  ],
})
export class AuthPackageModule {}

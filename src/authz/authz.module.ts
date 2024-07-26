import { Module, DynamicModule } from "@nestjs/common";
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({})
export class AuthzModule {
  static register(hello:string): DynamicModule {
    console.log("hello: " + hello);
    return {
      module: AuthzModule,
      imports: [PassportModule.register({ defaultStrategy: "jwt" })],
      providers: [JwtStrategy],
      exports: [PassportModule],
    };
  }
}

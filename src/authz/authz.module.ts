import { DynamicModule, Module } from "@nestjs/common";
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";




@Module({})
export class AuthzModule{
  static register(config: any): DynamicModule{
    console.log(`AuthzModule registered with config: ${config}`)
    return{
      module:AuthzModule,
      providers: [JwtStrategy],
      exports: [PassportModule]
    }
  }
}

// @Module({
//   imports: [PassportModule.register({ defaultStrategy: "jwt" })],
//   providers: [JwtStrategy],
//   exports: [PassportModule],
// })
// export class AuthzModule {}
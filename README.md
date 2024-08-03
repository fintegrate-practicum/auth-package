>>Title: Created and Published a New Package
---

Installation and Usage of fintegrate-auth
Installation
To install the package, run:

bash
Copy code
npm i fintegrate-auth@1.0.122
Usage
Import the module: Ensure authz is imported from fintegrate-auth/.
Apply the guard: Use @UseGuards(AuthGuard('jwt')) in your controller.
The package provides:

Token Verification: Validates the token.
User Data Injection: Adds user data to request for use in controllers.


Created a new package using TypeScript for the NestJS project.
Configured the package to include JwtStrategy and AuthzModule.
Successfully published the package to the npm registry under the name fintegrate-auth.
Ensured the package can be used in other projects by following standard import methods.

>>Changes:

Added an authz directory containing:
authz.module.ts
jwt.strategy.ts
Configured tsconfig.json for TypeScript compilation.
Updated package.json with the new package details.
Generated distribution files using tsc.
Published the package to npm.


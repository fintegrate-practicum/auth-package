>>Title: Created and Published a New Package
---

# `fintegrate-auth`

## Installation

To install the package, use the following command:

```bash
npm install fintegrate-auth@1.0.122
```
## Usage

### Apply the Guard

Use the `@UseGuards(AuthGuard('jwt'))` decorator in your controller to protect routes.

### Access User Data

After applying the guard, you can access the user data in your controller through `req.user`.

### Features

- **Token Verification**: Validates the JWT token provided in the request.
- **User Data Injection**: Injects user data into the request object for use in controllers.


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


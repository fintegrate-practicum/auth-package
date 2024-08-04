# `fintegrate-auth`

## Installation

To install the package, use the following command:

```bash
npm install fintegrate-auth@1.0.122
```
>נר<
## Usage
<br>

make sure to add the following environment variable in your project:

```bash
VITE_DOCKER_WORKERS_SERVER_URL=http://host.docker.internal:4006
```


<br>

###  Authenticate the user:

Use the `@UseGuards(AuthGuard('jwt'))` decorator in your controller to protect routes.

<br>


### Authorization by user role:

use the `@Roles` decorator, write the allow roles, according to the Role enum. 

add `RolesGuard` in the UseGuards decorator. 


make sure to import the above:

```bash
import { Role, Roles, RolesGuard } from "fintegrate-auth";

```

#### Eg:
<pre>@Roles(Role.Admin)<br>
@UseGuards(AuthGuard('jwt'), RolesGuard)</pre>
<br>


This ensures that only users with the appropriate roles can access certain routes.

<br>
<br>


 ⚠️    **Note**: Role management is not yet available for general use (in testing).

### Features

- **Token Verification**: Validates the JWT token provided in the request.
- **User Data Injection**: Injects user data into the request object for use in controllers.
- **Role-based Access Control**: Ensures that only users with the specified roles can access certain routes.


</br>
</br>
</br>
</br>



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


# `fintegrate-auth`
<br>


### `fintegrate-auth` is a package for managing user authentication and authorization in NestJS applications.
### It helps you secure your application by verifying user identity and controlling access based on user roles.<br><br><br>  
  
## Installation

To install the package, use the following command:

```bash
npm install fintegrate-auth
```
<br><br><br>
## Usage
<br>


###  Authenticate the user:

Use the `@UseGuards(AuthGuard('jwt'))` decorator in your controller to protect routes.  
This ensures that only authenticated users with a valid token can access the route,  
effectively blocking access for unauthorized users.<br>


### Authorization by user role:

use the `@Roles` decorator, write the allow roles, according to the Role enum. 

add `RolesGuard` in the UseGuards decorator. 


make sure to import the above:

```bash
import { Role, Roles, RolesGuard } from "fintegrate-auth";

```

#### Example:
<pre>@Roles(Role.Admin)<br>
@UseGuards(AuthGuard('jwt'), RolesGuard)</pre>
<br>


This ensures that only users with the appropriate roles can access certain routes.

<br>
<br>



### Features

- **Token Verification**: Validates the JWT token provided in the request.
- **User Data Injection**: Injects user data into the request object for use in controllers.
- **Role-based Access Control**: Ensures that only users with the specified roles can access certain routes.


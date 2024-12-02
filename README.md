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
Additionally, ensure that the HttpModule is imported in the module containing your controller:  
```bash
import { HttpModule } from '@nestjs/axios';

```
add the the HttpModule to imports array in the module.

#### Example:
<pre>@Roles(Role.Admin)<br>
@UseGuards(AuthGuard('jwt'), RolesGuard)</pre>
<br>


This ensures that only users with the appropriate roles can access certain routes.  
<br>

⚠️  Note:  
  
Role-based access control using the @Roles decorator is applicable only for routes that include a businessId parameter.  
This means that role-based permissions are only enforced if the user is logged into a specific business.  


<br>



### Features

- **Token Verification**: Validates the JWT token provided in the request.
- **User Data Injection**: Injects user data into the request object for use in controllers.
- **Role-based Access Control**: Ensures that only users with the specified roles can access certain routes.


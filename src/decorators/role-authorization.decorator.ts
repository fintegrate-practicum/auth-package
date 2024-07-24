import { SetMetadata } from '@nestjs/common';
import { Role } from './role-enum'; 

export const Auth = (...roles: Role[]) => SetMetadata('roles', roles);

// import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from './roles.guard'; // Assuming you have a RolesGuard implemented
// import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
// import { Role } from './role.enum'; // Importing the Role enum from role.enum.ts

// export function Auth(...roles: Role[]) {
//   return applyDecorators(
//     SetMetadata('roles', roles), // Setting metadata 'roles' with the roles array
//     UseGuards(AuthGuard(), RolesGuard), // Using AuthGuard and RolesGuard
//     ApiBearerAuth(), // Adding Bearer token authentication requirement to Swagger
//     ApiUnauthorizedResponse({ description: 'Unauthorized' }), // Unauthorized response description in Swagger
//   );
// }


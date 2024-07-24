import { SetMetadata } from '@nestjs/common';
import { Role } from './role-enum'; 

export const Auth = (...roles: Role[]) => SetMetadata('roles', roles);


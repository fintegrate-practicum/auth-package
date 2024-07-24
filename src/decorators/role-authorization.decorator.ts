import { SetMetadata } from '@nestjs/common';
import { Role } from './role-enum'; 

export const ROLES_KEY = 'roles'; //  משתנה קבוע עבור שם המטאדאטה

export const RolesGuard = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);



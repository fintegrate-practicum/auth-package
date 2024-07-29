import { SetMetadata } from 'import { SetMetadata } from '@nestjs/common';
import { Role } from './role-enum';
export const ROLES_METADATA_KEY = 'roles'; // משתנה קבוע לשם המטאדאטה

export const RolesGuard = (...roles: Role[]) => SetMetadata(ROLES_METADATA_KEY, roles);';
import { Role } from './role-enum';
export const ROLES_METADATA_KEY = 'roles';

export const RolesGuard = (...roles: Role[]) => SetMetadata(ROLES_METADATA_KEY, roles);



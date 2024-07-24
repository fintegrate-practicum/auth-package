import { SetMetadata } from '@nestjs/common';
import { Role } from './role-enum';
export const ROLES_METADATA_KEY = 'roles'; // משתנה קבוע לשם המטאדאטה

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_METADATA_KEY, roles);

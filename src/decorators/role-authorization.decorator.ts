import { SetMetadata } from '@nestjs/common';
import { Role } from './role-enum';
export const ROLES_METADATA_KEY = 'roles';

export const RolesGuard = (...roles: Role[]) => SetMetadata(ROLES_METADATA_KEY, roles);
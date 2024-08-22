import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../const/roles.const';

export const ROLES_KEY = 'user_roles';

export function Roles(role: RolesEnum) {
  return SetMetadata(ROLES_KEY, role);
}

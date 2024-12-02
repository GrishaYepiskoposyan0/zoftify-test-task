import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesEnum } from '../enums/roles.enum';

export const Auth = (roles: Array<RolesEnum>) => {
  return applyDecorators(SetMetadata('ROLES', roles), UseGuards(AuthGuard));
};

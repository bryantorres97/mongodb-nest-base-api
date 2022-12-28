import { applyDecorators, UseGuards } from '@nestjs/common';
// import { ValidRoles } from '../../common/interfaces/valid-roles';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function Authentication(...roles: string[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'No tiene permisos para realizar esta acción',
    }),
  );
}

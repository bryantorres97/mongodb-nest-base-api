import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles = this.reflector.get<string[]>(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles || validRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as object;
    if (!user)
      throw new UnauthorizedException('No se ha encontrado el usuario');

    // for (const role of user.roles) {
    //   if (validRoles.includes(role)) return true;
    // }
    return true;

    throw new ForbiddenException();
    // `El usuario ${user.fullName} no tiene permisos para realizar esta acción`,
  }
}

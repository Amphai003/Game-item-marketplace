import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true; // no role required

    const req = context.switchToHttp().getRequest();
    // For this demo we accept a header `x-user-role` containing the role name.
    // In a real app, decode JWT and read roles from user claims.
    const roleHeader = (req.headers['x-user-role'] || req.headers['x-role'] || '').toString();
    const userRoles = roleHeader.split(',').map((r: string) => r.trim()).filter(Boolean);

    return requiredRoles.some(r => userRoles.includes(r));
  }
}

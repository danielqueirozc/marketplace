import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private refletor: Reflector) {}

  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.refletor.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) return true

    const user = context.switchToHttp().getRequest().user
    if (!user || !user.role) throw new ForbiddenException('User role not found')

    const hasRole = requiredRoles.includes(user.role)
    if (!hasRole) throw new ForbiddenException(`Access denied. Required roles: ${requiredRoles.join(', ')}`)

    return true
  }
}

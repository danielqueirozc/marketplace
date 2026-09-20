import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) { // usado para pegar os metadados das minhas req
    super()
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(), // pegar qual o metodo
      context.getClass() // quao controller que esta sendo verificado
    ])

    if (isPublic) return true

    return super.canActivate(context) // passando para o AuthGuard lidar
  }

  // vai pegar erro se tiver, o user se tiver, e as infos
  handleRequest(error: any, user: any, _info: any) {
    if (error || !user) {
      throw error || new UnauthorizedException()
    }
    
    return user
  }
}

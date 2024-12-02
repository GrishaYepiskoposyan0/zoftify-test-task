import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IRequest } from '../interfaces/custom-request.interface';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RolesEnum } from '../enums/roles.enum';

function getBearerToken(request: IRequest): string | null {
  if (!request.headers.authorization) {
    return null;
  }
  const [prefix, token] = request.headers.authorization.split(' ');
  if (prefix === 'Bearer') {
    return token;
  }
  return null;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requiredRoles: Array<RolesEnum> = this.reflector.getAllAndOverride<
      Array<RolesEnum>
    >('ROLES', [context.getHandler(), context.getClass()]);
    const token: string = getBearerToken(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: any = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
        algorithms: ['HS512'],
      });
      if (!requiredRoles.includes(payload.role)) {
        throw new Error('Invalid Role!');
      }

      request.user = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      };
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}

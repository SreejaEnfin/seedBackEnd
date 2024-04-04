import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './auth.decorator';
import { UsersService } from 'src/users/users.service';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
    private roleService: RoleService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const configService = this.configService;
      const payload = await this.jwtService.verifyAsync(token, {
        secret: configService.get('JWT_SECRET'),
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      let aclObject = {};
      const user = await this.usersService.findOne(payload._id);

      if(user.roleIds?.length > 0) {
        const roles = await this.roleService.findByIds(user.roleIds);
  
        const aclArray = [user.acl, ...roles.map(r => r.acl)].filter(x => x);
  
        for(const acl of aclArray) {
          const aclKeys = Object.keys(acl);
          for(const aclKey of aclKeys) {
            if(!aclObject[aclKey]) {
              aclObject[aclKey] = {};
            }
            const aclFeatKeys = Object.keys(acl[aclKey]);
            for(const aclFeatKey of aclFeatKeys) {
              if(!aclObject[aclKey][aclFeatKey]) {
                aclObject[aclKey][aclFeatKey] = { ...acl[aclKey][aclFeatKey] };
              } else if(acl[aclKey][aclFeatKey].permission) {
                aclObject[aclKey][aclFeatKey].permission = true;
              }
            }
          }
        }
      }

      // console.log(aclObject);
      
      request['user'] = { ...payload, acl: aclObject};
    } catch(e) {
      console.log(e)
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

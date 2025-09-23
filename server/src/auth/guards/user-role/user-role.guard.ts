import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { Usuario } from 'src/entities/entities/Usuario.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    //ayuda a ver info de la metadata del controlador
    private readonly reflector:Reflector
  ){}


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {


    const validRoles:string[] =this.reflector.get(META_ROLES,context.getHandler())
    const req = context.switchToHttp().getRequest()

    if(!validRoles || validRoles.length===0){
      return true;
    }

    const user:Usuario = req.user

    if(!user){
      throw new BadRequestException("user not found")
    }

    for (const role of validRoles){
      if(user.rol===role){
        return true;
      }
    }


    throw new ForbiddenException(`No se puede acceder, se necesita al menos un rol: ${validRoles}`)
  }
}

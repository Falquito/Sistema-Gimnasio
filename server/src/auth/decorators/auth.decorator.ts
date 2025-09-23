
import { applyDecorators, UseGuards } from '@nestjs/common';
import { validRoles } from '../interfaces/validRoles';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(...roles: validRoles[]) {
  return applyDecorators(

    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard)
  );
}

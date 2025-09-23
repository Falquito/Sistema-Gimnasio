import { validRoles } from '../interfaces/validRoles';
export declare const META_ROLES = "roles";
export declare const RoleProtected: (...args: validRoles[]) => import("@nestjs/common").CustomDecorator<string>;

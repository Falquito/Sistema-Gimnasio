import { validRoles } from '../interfaces/validRoles';
export declare function Auth(...roles: validRoles[]): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;

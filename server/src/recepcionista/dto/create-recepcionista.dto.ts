import { IsEmail, IsNumber, IsString } from "class-validator";

export class CreateRecepcionistaDto {
    @IsString()
    nombre:string;
    @IsString()
    apellido:string;
    @IsString()
    telefono:string;
    @IsString()
    dni:string;
    @IsString()
    fecha_alta:string;
    @IsString()
    fecha_ult_upd:string;

    @IsString()
    @IsEmail()
    email:string;

    @IsString()
    password:string;
}

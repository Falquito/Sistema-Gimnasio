import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateGerenteDto {

    @IsString()
    nombre:string;

    @IsString()
    apellido:string;

    @IsString()
    telefono:string;

    @IsString()
    dni:string;

    @IsEmail()
    email:string;

    @IsString()
    contraseña:string;


}

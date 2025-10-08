import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateGerenteDto {
    @ApiProperty()
    @IsString()
    nombre:string;
    @ApiProperty()
    @IsString()
    apellido:string;
    @ApiProperty()
    @IsString()
    telefono:string;
    @ApiProperty()
    @IsString()
    dni:string;
    @ApiProperty()
    @IsEmail()
    email:string;
    @ApiProperty()
    @IsString()
    contraseña:string;


}
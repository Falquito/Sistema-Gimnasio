import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEmail, IsIn, IsNumber, IsString } from "class-validator";

export class CreateProfesionaleDto {
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
    @IsIn(["Psicologia","Psicopedagogia","Psiqiuatria","Fonoaudiologia"])
    servicio:string;

    @IsArray()
    @Type(()=>ObraSocialDto)
    ObrasSociales:ObraSocialDto[]
}

export class ObraSocialDto{
    @IsNumber()
    idObraSocial:number;
}

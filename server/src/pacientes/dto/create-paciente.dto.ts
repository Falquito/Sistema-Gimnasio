import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePacienteDto {
    @ApiProperty()
    @IsString()
    @MinLength(3)
    nombre:string;
    @ApiProperty()
    @MinLength(3)
    @IsString()
    apellido:string;
    @ApiProperty()
    @IsString()
    telefono:string;
    @ApiProperty()
    @IsString()
    @MaxLength(9)
    dni:string; 
    @ApiProperty()
    @IsString()
    @IsIn(["M","F"])
    genero:string;
    @ApiProperty()
    @IsString()
    fecha_nacimiento:string;
    @ApiProperty()
    @IsString()
    observaciones:string;
    @ApiProperty()
    @IsString()
    email:string;
    @ApiProperty()
    @IsNumber()
    nro_obraSocial:number;
    @ApiProperty()
    @IsNumber()
    id_obraSocial:number;
}

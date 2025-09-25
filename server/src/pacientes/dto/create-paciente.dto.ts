import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNumber, IsString } from "class-validator";

export class CreatePacienteDto {
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
    @IsString()
    @IsIn(["M","F"])
    genero:string;
    @ApiProperty()
    @IsString()
    fecha_nacimiento:string;
    @ApiProperty()
    @IsString()
    observaciones:string;
}

import { IsIn, IsNumber, IsString } from "class-validator";

export class CreatePacienteDto {
    @IsString()
    nombre:string;
    @IsString()
    apellido:string;
    @IsString()
    telefono:string;
    @IsString()
    dni:string;
    @IsString()
    genero:string;
    @IsString()
    fecha_nacimiento:string;
    @IsString()
    observaciones:string;
}

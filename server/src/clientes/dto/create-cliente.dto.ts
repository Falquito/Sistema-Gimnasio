import { IsIn, IsNumber, IsString } from "class-validator";

export class CreateClienteDto {
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
    fecha_alta:string;
    @IsString()
    fecha_alta_upd:string;
    @IsNumber()
    peso:number;
    @IsNumber()
    altura:number;
    @IsString()
    fecha_nacimiento:string;
    @IsString()
    observaciones:string;
    @IsString()
    nivel_fisico:string;
    @IsIn(["Hipertrofia","Zumba"])
    servicio:string;
}

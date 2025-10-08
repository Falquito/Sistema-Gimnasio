import { IsEnum, IsOptional, IsString } from "class-validator";
import { EstadoMedicacion } from "src/entities/entities/Medicacion.entity";


export class UpdateMedicacionDto {
  @IsOptional() @IsString()
  farmaco?: string;

  @IsOptional() @IsString()
  dosis?: string;

  @IsOptional() @IsString()
  frecuencia?: string;

  @IsOptional() @IsString()
  indicacion?: string;

  @IsOptional() @IsString()
  fechaInicio?: string;

  @IsOptional() @IsString()
  fechaFin?: string;

  @IsOptional() @IsEnum(EstadoMedicacion)
  estado?: EstadoMedicacion;

  @IsOptional() @IsString()
  ultimaAdmin?: string;
}

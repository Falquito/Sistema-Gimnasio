import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { EstadoMedicacion } from "src/entities/entities/Medicacion.entity";

export class CrearMedicacionDto {
  // Opción A: asociada a un turno (derivamos paciente y profesional)
  @IsOptional() @IsInt() @Min(1)
  turnoId?: number;

  // Opción B: sin turno -> se requieren ambos
  @IsOptional() @IsInt() @Min(1)
  pacienteId?: number;

  @IsOptional() @IsInt() @Min(1)
  profesionalId?: number;

  @IsOptional() @IsString()
  farmaco: string;

  @IsOptional() @IsString()
  dosis?: string;

  @IsOptional() @IsString()
  frecuencia?: string;

  @IsOptional() @IsString()
  indicacion?: string;

  @IsString() @IsNotEmpty()
  fechaInicio: string; // YYYY-MM-DD

  @IsOptional() @IsString()
  fechaFin?: string; // si ya la cerrás al crear

  @IsOptional() @IsEnum(EstadoMedicacion)
  estado?: EstadoMedicacion; // default ACTIVO

  @IsOptional() @IsString()
  ultimaAdmin?: string; // si registrás una administración inicial
}

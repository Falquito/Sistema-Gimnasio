import { IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CrearAnotacionDto {
  // Opción A: pasar turnoId (y derivamos paciente/profesional)
  @IsOptional() @IsInt() @Min(1)
  turnoId?: number;

  // Opción B: si no hay turnoId, deben venir ambos:
  @IsOptional() @IsInt() @Min(1)
  pacienteId?: number;

  @IsOptional() @IsInt() @Min(1)
  profesionalId?: number;

  // Fecha/hora opcionales. Si faltan, fecha = hoy y hora = (de turno si viene, sino null)
  @IsOptional() @IsString()
  fecha?: string; // YYYY-MM-DD

  @IsOptional() @IsString()
  hora?: string;  // HH:mm

  @IsString() @MinLength(10)
  texto: string;
}

import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, MinLength } from "class-validator";
import { CertezaDiagnostico, EstadoDiagnostico } from "src/entities/entities/Diagnostico.entity";

export class CrearDiagnosticoDto {
  @IsInt() @Min(1)
  turnoId: number;

  // si no viene, se setea hoy (YYYY-MM-DD) en el service
  @IsOptional() @IsString()
  fecha?: string;

  @IsOptional() @IsEnum(EstadoDiagnostico)
  estado?: EstadoDiagnostico; // default ACTIVO

  @IsOptional() @IsEnum(CertezaDiagnostico)
  certeza?: CertezaDiagnostico; // default EN_ESTUDIO

  @IsString() @IsNotEmpty()
  codigoCIE: string;

  @IsString() @MinLength(10)
  sintomasPrincipales: string;

  @IsOptional() @IsString()
  observaciones?: string;
}

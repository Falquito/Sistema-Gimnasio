import { IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { CertezaDiagnostico, EstadoDiagnostico } from "src/entities/entities/Diagnostico.entity";

export class UpdateDiagnosticoDto {
  @IsOptional() @IsString()
  fecha?: string; // se vuelve a validar no-futura en el service

  @IsOptional() @IsEnum(EstadoDiagnostico)
  estado?: EstadoDiagnostico;

  @IsOptional() @IsEnum(CertezaDiagnostico)
  certeza?: CertezaDiagnostico;

  @IsOptional() @IsString()
  codigoCIE?: string;

  @IsOptional() @IsString() @MinLength(10)
  sintomasPrincipales?: string;

  @IsOptional() @IsString()
  observaciones?: string;
}

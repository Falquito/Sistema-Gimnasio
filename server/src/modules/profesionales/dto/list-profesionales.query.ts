import { IsBooleanString, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListProfesionalesQuery {
  @IsOptional()
  @IsUUID()
  servicioId?: string;

  @IsOptional()
  @IsBooleanString()
  activo?: string; // "true" | "false" (lo convertimos a boolean luego)

  @IsOptional()
  q?: string; // texto libre (nombre, documento, etc.)

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  limit?: number = 20;
}
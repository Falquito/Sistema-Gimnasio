import { IsISO8601, IsInt, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class DisponibilidadQuery {
  @Type(() => Number) @IsInt() @IsPositive()
  servicioId: number; // requerido

  @IsOptional()
  @Type(() => Number) @IsInt() @IsPositive()
  profesionalId?: number;

  // O bien pedir un día o un rango
  @IsOptional() @IsISO8601()
  fecha?: string; // YYYY-MM-DD o full ISO (tomamos el día en tz del server)

  @IsOptional() @IsISO8601()
  desde?: string; // ISO

  @IsOptional() @IsISO8601()
  hasta?: string; // ISO

  // Por si tu Servicio no tiene duración en DB (fallback)
  @IsOptional()
  @Type(() => Number) @IsInt() @IsPositive()
  duracionMin?: number;
}

import { IsISO8601, IsInt, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class AgendaQuery {
  @Type(() => Number) @IsInt() @IsPositive()
  @IsOptional()
  profesionalId: number;

  @IsISO8601()
  @IsOptional()
  desde: string;

  @IsOptional()
  estado?: string; // PENDIENTE|CONFIRMADO|CANCELADO|
}

import { IsISO8601, IsInt, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class AgendaQuery {
  @Type(() => Number) @IsInt() @IsPositive()
  profesionalId: number;

  @IsISO8601()
  desde: string;

  @IsISO8601()
  hasta: string;

  @IsOptional()
  estado?: string; // PENDIENTE|CONFIRMADO|CANCELADO|
}

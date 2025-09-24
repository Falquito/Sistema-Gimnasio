import { IsISO8601, IsInt, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearTurnoDto {
  @Type(() => Number) @IsInt() @IsPositive()
  clienteId: number;

  @Type(() => Number) @IsInt() @IsPositive()
  servicioId: number;

  @Type(() => Number) @IsInt() @IsPositive()
  profesionalId: number;

  @IsISO8601()
  inicio: string; // timestamptz ISO

  @IsString()
  rutina:string;
  @IsString()
  observacion:string;
}

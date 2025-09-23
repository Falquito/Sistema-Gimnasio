import { IsISO8601 } from 'class-validator';

export class ReprogramarTurnoDto {
  @IsISO8601()
  nuevoInicio: string;
}

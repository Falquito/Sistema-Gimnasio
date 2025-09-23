import { IsOptional, IsString } from 'class-validator';

export class CancelarTurnoDto {
  @IsOptional() @IsString()
  motivo?: string;
}

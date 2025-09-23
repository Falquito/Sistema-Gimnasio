import { IsOptional, IsString } from 'class-validator';

export class UpdateServicioDto {
  @IsString()
  @IsOptional()
  nombre?: string;
}

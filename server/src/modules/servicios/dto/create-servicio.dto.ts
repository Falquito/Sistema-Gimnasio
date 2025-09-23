import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateServicioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}

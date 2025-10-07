import { IsOptional, IsString } from "class-validator";

export class AdministrarMedicacionDto {
  @IsOptional() @IsString()
  fecha?: string; // default hoy
}
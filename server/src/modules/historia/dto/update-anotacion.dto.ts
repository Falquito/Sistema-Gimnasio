import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateAnotacionDto {
  @IsOptional() @IsString()
  fecha?: string;   

  @IsOptional() @IsString()
  hora?: string;

  @IsOptional() @IsString() @MinLength(10)
  texto?: string;
}

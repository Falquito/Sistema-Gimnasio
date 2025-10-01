import { IsISO8601, IsInt, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CrearTurnoDto {
 
  @ApiProperty({example:1})
  @Type(() => Number) @IsInt() @IsPositive()
  profesionalId: number;
  @ApiProperty({example:1})
  @Type(() => Number) @IsInt() @IsPositive()
  recepcionistaId: number;
  @ApiProperty({example:"2011-10-05T14:48:00.000Z"})
  @IsISO8601()
  inicio: string; // timestamptz ISO
  
  @ApiProperty({example:1})
  @Type(() => Number) @IsInt() @IsPositive()
  pacienteId: number;
  @ApiProperty()
  @IsString()
  @IsOptional()
  observacion:string;
}

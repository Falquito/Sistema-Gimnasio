import { PartialType } from '@nestjs/mapped-types';
import { CrearTurnoDto } from './crear-turno.dto'

export class UpdateTurnoDto extends PartialType(CrearTurnoDto) {}
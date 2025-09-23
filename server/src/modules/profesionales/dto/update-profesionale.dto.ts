import { PartialType } from '@nestjs/mapped-types';
import { CreateProfesionaleDto } from './create-profesionale.dto';

export class UpdateProfesionaleDto extends PartialType(CreateProfesionaleDto) {}

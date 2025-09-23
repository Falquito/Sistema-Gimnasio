import { PartialType } from '@nestjs/mapped-types';
import { CreateGerenteDto } from './create-gerente.dto';

export class UpdateGerenteDto extends PartialType(CreateGerenteDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreateRecepcionistaDto } from './create-recepcionista.dto';

export class UpdateRecepcionistaDto extends PartialType(CreateRecepcionistaDto) {}

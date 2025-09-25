import { PartialType } from '@nestjs/swagger';
import { CreateObraSocialDto } from './create-obra-social.dto';

export class UpdateObraSocialDto extends PartialType(CreateObraSocialDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreatePacienteDto } from './create-paciente.dto';

export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {}

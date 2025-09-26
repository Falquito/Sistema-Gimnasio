import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PacienteService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { validRoles } from 'src/auth/interfaces/validRoles';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacienteService: PacienteService) {}
  @Auth(validRoles.medico,validRoles.recepcionista)

  @Post()
  create(@Body() createClienteDto: CreatePacienteDto) {
    return this.pacienteService.create(createClienteDto);
  }
  @Auth(validRoles.medico,validRoles.recepcionista)

  @Get()
  findAll() {
    return this.pacienteService.findAll();
  }
  @Auth(validRoles.medico,validRoles.recepcionista)

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pacienteService.findOne(+id);
  }
  @Auth(validRoles.medico,validRoles.recepcionista)

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdatePacienteDto) {
    return this.pacienteService.update(+id, updateClienteDto);
  }
  @Auth(validRoles.medico,validRoles.recepcionista)

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pacienteService.remove(+id);
  }
}

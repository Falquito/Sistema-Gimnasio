import { Injectable } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

@Injectable()
export class ServiciosService {
  create(createServicioDto: CreateServicioDto) {
    return 'This action adds a new servicio';
  }

  findAll() {
    return `This action returns all servicios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} servicio`;
  }

  update(id: number, updateServicioDto: UpdateServicioDto) {
    return `This action updates a #${id} servicio`;
  }

  remove(id: number) {
    return `This action removes a #${id} servicio`;
  }
}

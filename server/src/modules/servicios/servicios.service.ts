import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicio } from 'src/entities/entities/Servicio.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private readonly servRepo: Repository<Servicio>,
  ) {}

  findAll() {
    return this.servRepo.find();
  }

  async findOne(id: number) {
    const servicio = await this.servRepo.findOne({ where: { idServicio: id } });
    if (!servicio) throw new NotFoundException('Servicio no encontrado');
    return servicio;
  }

  create(dto: CreateServicioDto) {
    const servicio = this.servRepo.create(dto);
    return this.servRepo.save(servicio);
  }

  async update(id: number, dto: UpdateServicioDto) {
    const servicio = await this.findOne(id);
    Object.assign(servicio, dto);
    return this.servRepo.save(servicio);
  }

  async remove(id: number) {
    const servicio = await this.findOne(id);
    return this.servRepo.remove(servicio);
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Servicio } from 'src/entities/entities/Servicio.entity';
import { Cliente } from './entities/cliente.entity';
import { ClientesPorServicios } from 'src/entities/entities/ClientesPorServicios.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectDataSource()
    private readonly dataSource:DataSource
  ){}
  async create(createClienteDto: CreateClienteDto) {
    const {nombre,apellido,dni,altura,genero,fecha_alta,fecha_alta_upd,fecha_nacimiento,nivel_fisico,observaciones,peso,servicio,telefono} = createClienteDto
    const queryRunner =  this.dataSource.createQueryRunner()

    await queryRunner.connect()

    await queryRunner.startTransaction()

    try {
      const servicioBdd = await queryRunner.manager.findOneBy(Servicio,{
        nombre:nombre
      })

      const cliente = queryRunner.manager.create(Cliente,createClienteDto)

      await queryRunner.manager.save(cliente)

      const servicioPorCliente = queryRunner.manager.create(ClientesPorServicios,{
        idCliente:cliente!,
        idServicio:servicioBdd!
      })

      await queryRunner.manager.save(servicioPorCliente)

      await queryRunner.commitTransaction()
      return cliente
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException(error)
    }finally{
      await queryRunner.release()
    }
  }

  findAll() {
    return `This action returns all clientes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cliente`;
  }

  update(id: number, updateClienteDto: UpdateClienteDto) {
    return `This action updates a #${id} cliente`;
  }

  remove(id: number) {
    return `This action removes a #${id} cliente`;
  }
}

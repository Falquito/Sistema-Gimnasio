import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
// import { Servicio } from 'src/entities/entities/Servicio.entity';
import { Paciente } from './entities/paciente.entity';
import { ObraSocial } from 'src/entities/entities/ObraSocial.entity';
// import { ClientesPorServicios } from 'src/entities/entities/ClientesPorServicios.entity';

@Injectable()
export class PacienteService {
  constructor(
    @InjectDataSource()
    private readonly dataSource:DataSource,
    @InjectRepository(Paciente)
    private readonly pacienteRepository:Repository<Paciente>,
    @InjectRepository(ObraSocial)
    private readonly obraSocialRepository:Repository<ObraSocial>
  ){}
  async create(createPacienteDto: CreatePacienteDto) {
    const {nombre,apellido,dni,genero,fecha_nacimiento,observaciones,telefono,email,nro_obraSocial,id_obraSocial} = createPacienteDto
    const queryRunner =  this.dataSource.createQueryRunner()

    await queryRunner.connect()

    await queryRunner.startTransaction()

    try {
      // const servicioBdd = await queryRunner.manager.findOneBy(Servicio,{
      //   nombre:servicio
      // })

      const obraSocial = await queryRunner.manager.findOneBy(ObraSocial,{
        id_os:id_obraSocial
      })
      const cliente = queryRunner.manager.create(Paciente,{
        nombre_paciente:nombre,
        apellido_paciente:apellido,
        telefono_paciente:telefono,
        dni:dni,
        genero:genero,
        fecha_nacimiento:fecha_nacimiento,
        observaciones:observaciones,
        email:email,
        nro_obrasocial:nro_obraSocial,
        obraSocial:obraSocial!
      })

      await queryRunner.manager.save(cliente)

      // const servicioPorCliente = queryRunner.manager.create(ClientesPorServicios,{
      //   idCliente:cliente!,
      //   idServicio:servicioBdd!
      // })

      // await queryRunner.manager.save(servicioPorCliente)

      await queryRunner.commitTransaction()
      return cliente
    } catch (error) {
      await queryRunner.rollbackTransaction()
      console.log(error)
      throw new InternalServerErrorException(error)
    }finally{
      await queryRunner.release()
    }
  }

  async findAll() {
    return await this.pacienteRepository.find()
  }


  async update(id:number,updatePacienteDto:UpdatePacienteDto){
    const paciente = await this.pacienteRepository.findOneBy({id_paciente:id})
    if(!paciente){
      throw new NotFoundException(`No se encontro el paiente con el id: ${id}`)
    }
    const obraSocial = await this.obraSocialRepository.findOneBy({
        id_os:updatePacienteDto.id_obraSocial
      })

    const pacienteUpdated = await this.pacienteRepository.preload({
      
      id_paciente:paciente.id_paciente,
      apellido_paciente:updatePacienteDto.apellido?updatePacienteDto.apellido:paciente.apellido_paciente,
      nombre_paciente:updatePacienteDto.nombre?updatePacienteDto.nombre:paciente.nombre_paciente,
      fecha_nacimiento:updatePacienteDto.fecha_nacimiento?updatePacienteDto.fecha_nacimiento:paciente.fecha_nacimiento,
      dni:updatePacienteDto.dni?updatePacienteDto.dni:paciente.dni,
      genero:updatePacienteDto.genero?updatePacienteDto.genero:paciente.genero,
      observaciones:updatePacienteDto.observaciones?updatePacienteDto.observaciones:paciente.observaciones,
      telefono_paciente:updatePacienteDto.telefono?updatePacienteDto.telefono:paciente.telefono_paciente,
      email:updatePacienteDto.email?updatePacienteDto.email:paciente.email,
      obraSocial:updatePacienteDto.id_obraSocial?obraSocial!:paciente.obraSocial,
      nro_obrasocial:updatePacienteDto.nro_obraSocial?updatePacienteDto.nro_obraSocial:paciente.nro_obrasocial
    })

    return this.pacienteRepository.save(pacienteUpdated!);

  }
  async findOne(id: number) {
    return await this.pacienteRepository.findOneBy({id_paciente:id})
  }

  async remove(id:number){
    const paciente = await this.findOne(id)
    const pacienteDeleted = await this.pacienteRepository.preload({...paciente,estado:false})
    return await this.pacienteRepository.save(pacienteDeleted!)
  }


}

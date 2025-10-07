import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRecepcionistaDto } from './dto/create-recepcionista.dto';
import { UpdateRecepcionistaDto } from './dto/update-recepcionista.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Recepcionista } from 'src/entities/entities/Recepcionista.entity';
import { RolUsuario, Usuario } from 'src/entities/entities/Usuario.entity';
import * as bcrypt from 'bcrypt'
@Injectable()
export class RecepcionistaService {
  constructor(
    @InjectDataSource()
    private readonly dataSource:DataSource,
    @InjectRepository(Recepcionista)
    private readonly recepcionistaRepository:Repository<Recepcionista>
  ){}
  async create(createRecepcionistaDto: CreateRecepcionistaDto) {
    const {apellido,dni,fecha_alta,fecha_ult_upd,email,password,nombre,telefono}= createRecepcionistaDto
    const queryRunner = this.dataSource.createQueryRunner()
    const contraseñaHasheada = await this.hashPassword(password)

    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      const usuario = queryRunner.manager.create(Usuario,{
        email:email,
        contraseA:contraseñaHasheada,
        rol:RolUsuario.RECEPCIONISTA
      })

      await queryRunner.manager.save(usuario)
      const recepcionista = queryRunner.manager.create(Recepcionista,{
        apellidoRecepcionista:apellido,
        dni:dni,
        fechaAlta:fecha_alta,
        fechaUltUpd:fecha_ult_upd,
        idUsuario:usuario,
        nombreRecepcionista:nombre,
        telefonoRecepcionista:telefono,
      })

      await queryRunner.manager.save(recepcionista)
      await queryRunner.commitTransaction()
      return recepcionista
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException(error)
    }finally{
      await queryRunner.release()
    }
  }

  async findAll() {
    return await this.recepcionistaRepository.find()
  }

  async findOne(id: number) {
    return await this.recepcionistaRepository.findOneBy({idRecepcionista:id})
  }

  // update(id: number, updateRecepcionistaDto: UpdateRecepcionistaDto) {
  //   return `This action updates a #${id} recepcionista`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} recepcionista`;
  // }
  private async hashPassword(plainPassword: string): Promise<string> {
      const saltRounds = 10; // costo, más alto = más seguro pero más lento
      const salt = await bcrypt.genSalt(saltRounds);
      const hashed = await bcrypt.hash(plainPassword, salt);
    return hashed;
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGerenteDto } from './dto/create-gerente.dto';
import { UpdateGerenteDto } from './dto/update-gerente.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { RolUsuario, Usuario } from 'src/entities/entities/Usuario.entity';
import { Gerente } from './entities/gerente.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class GerentesService {

  constructor(
    @InjectDataSource()
    private readonly dataSource:DataSource,
    @InjectRepository(Usuario)
    private readonly usuarioRepository:Repository<Usuario>,
    @InjectRepository(Gerente)
    private readonly gerenteRepository:Repository<Gerente>
  ){}
  async create(createGerenteDto: CreateGerenteDto) {
    const {apellido,dni,nombre,telefono,email,contraseña} = createGerenteDto
    const queryRunner = this.dataSource.createQueryRunner()
    const fecha = new Date();
    const contraseñaHasheada = await this.hashPassword(contraseña)

    const year = fecha.getFullYear() % 100; // últimos 2 dígitos
    const month = fecha.getMonth() + 1; // los meses van de 0 a 11
    const day = fecha.getDate();
 
    const fechaFormateada = `${year.toString().padStart(2,'0')}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      
      //Creo el usuario con el gmail y correo del gerente
      const usuario = queryRunner.manager.create(Usuario,{
        
        email,
        contraseA:contraseñaHasheada,
        rol:RolUsuario.GERENTE
      })

      console.log(usuario)
      await queryRunner.manager.save(usuario)
      const gerente = queryRunner.manager.create(Gerente,{
        idUsuario:usuario,
        nombreGerente:nombre,
        apellidoGerente:apellido,
        dni:dni,
        telefonoGerente:telefono,
        fechaAlta:fechaFormateada,
        fechaUltUpd:"-"
      })

      await queryRunner.manager.save(gerente)

      await queryRunner.commitTransaction()
      return gerente;

    } catch (error) {
      await queryRunner.rollbackTransaction()
      console.log(error)
      throw new InternalServerErrorException("Necesito que revise los logs por favor.")
    }finally{
      await queryRunner.release()
    }
  }

  async findAll() {
    return await this.gerenteRepository.find()
  }

  async findOne(id: number) {
    return this.gerenteRepository.findOneBy({idGerente:id})
  }

  update(id: number, updateGerenteDto: UpdateGerenteDto) {
    return `This action updates a #${id} gerente`;
  }

  remove(id: number) {
    return `This action removes a #${id} gerente`;
  }

  private async hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10; // costo, más alto = más seguro pero más lento
    const salt = await bcrypt.genSalt(saltRounds);
    const hashed = await bcrypt.hash(plainPassword, salt);
  return hashed;
}
}
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateObraSocialDto } from './dto/create-obra-social.dto';
import { UpdateObraSocialDto } from './dto/update-obra-social.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ObraSocial } from 'src/entities/entities/ObraSocial.entity';

@Injectable()
export class ObraSocialService {
  constructor(
    @InjectDataSource()
    private readonly dataSource:DataSource,
    @InjectRepository(ObraSocial)
    private readonly obraSocialRepository:Repository<ObraSocial>

  ){}
  async create(createObraSocialDto: CreateObraSocialDto) {
    const queryRunner = this.dataSource.createQueryRunner()
    const {nombre} = createObraSocialDto
    try {
      queryRunner.connect()
      queryRunner.startTransaction()
      const fecha = new Date();
      const year = fecha.getFullYear() % 100; // últimos 2 dígitos
      const month = fecha.getMonth() + 1; // los meses van de 0 a 11
      const day = fecha.getDate();
 
      const fechaFormateada = `${year.toString().padStart(2,'0')}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;

      const obraSocial = queryRunner.manager.create(ObraSocial,{
        nombre:nombre,
        fecha_alta:fechaFormateada
      })

      queryRunner.commitTransaction()
      return await queryRunner.manager.save(obraSocial)
    } catch (error) {
      console.log(error)
      queryRunner.rollbackTransaction()
      throw new InternalServerErrorException("Necesito que veas los logs")
    }finally{
      queryRunner.release()
    }
  }

  async findAll() {
    return await this.obraSocialRepository.find()
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} obraSocial`;
  // }

  // update(id: number, updateObraSocialDto: UpdateObraSocialDto) {
  //   return `This action updates a #${id} obraSocial`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} obraSocial`;
  // }
}

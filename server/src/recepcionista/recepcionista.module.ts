import { Module } from '@nestjs/common';
import { RecepcionistaService } from './recepcionista.service';
import { RecepcionistaController } from './recepcionista.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recepcionista } from 'src/entities/entities/Recepcionista.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Recepcionista])],
  controllers: [RecepcionistaController],
  providers: [RecepcionistaService],
})
export class RecepcionistaModule {}

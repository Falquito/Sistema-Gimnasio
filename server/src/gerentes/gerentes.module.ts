import { Module } from '@nestjs/common';
import { GerentesService } from './gerentes.service';
import { GerentesController } from './gerentes.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/entities/entities/Usuario.entity';
import { Gerente } from './entities/gerente.entity';

@Module({
  imports:[
    AuthModule,
    TypeOrmModule.forFeature([Usuario,Gerente])
  ],
  controllers: [GerentesController],
  providers: [GerentesService],
})
export class GerentesModule {}
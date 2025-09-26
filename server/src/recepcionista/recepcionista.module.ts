import { Module } from '@nestjs/common';
import { RecepcionistaService } from './recepcionista.service';
import { RecepcionistaController } from './recepcionista.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recepcionista } from 'src/entities/entities/Recepcionista.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[AuthModule,PassportModule, TypeOrmModule.forFeature([Recepcionista])],
  controllers: [RecepcionistaController],
  providers: [RecepcionistaService],
})
export class RecepcionistaModule {}

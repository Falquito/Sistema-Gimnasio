// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/entities/entities/Usuario.entity';
import { Repository } from 'typeorm';
import { Profesionales } from 'src/entities/entities/Profesionales.entity';
import { Recepcionista } from 'src/entities/entities/Recepcionista.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async login(dto: LoginDto) {
    const { email, password } = dto;

    // Trae relaciones para poder armar el payload
    const user = await this.usuarioRepository.findOne({
      where: { email },
      relations: ['profesionales', 'recepcionistas', 'gerentes'],
    });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const match = await bcrypt.compare(password, user.contraseA!);
    if (!match) throw new UnauthorizedException('Contraseña invalida');

    // nombre visible según rol
    let nombre = '';
    if (user.rol === 'medico') {
      nombre = user.profesionales?.[0]?.nombreProfesional ?? '';
    } else if (user.rol === 'gerente') {
      nombre = user.gerentes?.[0]?.nombreGerente ?? '';
    } else if (user.rol === 'recepcionista') {
      nombre = user.recepcionistas?.[0]?.nombreRecepcionista ?? '';
    }

    
    const professionalId =
      user.rol === 'medico' ? user.profesionales?.[0]?.idProfesionales ?? null : null;

    const payload: JwtPayload = {
      sub: user.idUsuario,   
      rol: user.rol!,
      nombre,
      professionalId,
      idProfesional: professionalId!  
      
    };

  
    return {
      token: this.getJwtToken(payload),
      user: {
        id: user.idUsuario,
        email: user.email,
        rol: user.rol,
        nombre,
        professionalId,
      },
    };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async refresh(token: string) {
    try {
      // Verificamos y reutilizamos el payload actual
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      // Volvemos a firmar con el MISMO payload (o lo mínimo que quieras mantener)
      const newAccessToken = await this.jwtService.signAsync(
        {
          sub: payload.sub,
          rol: payload.rol,
          nombre: payload.nombre,
          professionalId: payload.professionalId ?? null,
     
        } as JwtPayload,
        { expiresIn: '1h' },
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashed = await bcrypt.hash(plainPassword, salt);
    return hashed;
  }
}

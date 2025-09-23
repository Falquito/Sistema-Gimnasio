import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/entities/entities/Usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Usuario)
    private readonly usuarioRepository:Repository<Usuario>
  ) {}


  async login(dto: LoginDto) {
    const {email,password} = dto
    const user = await this.usuarioRepository.findOneBy({email:email})
    console.log(user)
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const match = await bcrypt.compare(password, user.contraseA!);
    if (!match) throw new UnauthorizedException('Contraseña invalida');

    return {
      ...user,
      token:this.getJwtToken({id:user.idUsuario,rol:user.rol!})
    }
  }


  private getJwtToken(payload:JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }
  async refresh(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const newAccessToken = await this.jwtService.signAsync(
        { sub: payload.sub, email: payload.email },
        { expiresIn: '15m' },
      );
      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async hashPassword(plainPassword: string): Promise<string> {
      const saltRounds = 10; // costo, más alto = más seguro pero más lento
      const salt = await bcrypt.genSalt(saltRounds);
      const hashed = await bcrypt.hash(plainPassword, salt);
    return hashed;
  }
}

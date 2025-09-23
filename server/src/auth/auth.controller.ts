import { Body, Controller, Get, Post, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from 'src/decorators/raw-header.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { validRoles } from './interfaces/validRoles';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') token: string) {
    return this.authService.refresh(token);
  }

  @Get("private")
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request:Express.Request,
    @GetUser() user,
    @GetUser("idGerente") userEmail:string,
    @RawHeaders() RawHeaders:string[]
  ){
    console.log(request)
    return {
      ok:true,
      user:user,
      userEmail,
      RawHeaders
    }
  }

  @Get("private2")
  //añade info extra al controlador
  // @SetMetadata("roles",["admin,super-user"])
  @RoleProtected(validRoles.gerente,validRoles.recepcionista)
  @UseGuards(AuthGuard(),UserRoleGuard)
  privateRoute2(
    @GetUser() user
  ){
    return {
      ok:true,
      user
    }
  }


  @Get("private3")
  @Auth(validRoles.recepcionista,validRoles.trainer)
  privateRoute3(
    @GetUser() user
  ){
    return {
      ok:true,
      user
    }
  }
}

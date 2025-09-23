import { ApiProperty } from "@nestjs/swagger";

export class UsuarioResponse{
    @ApiProperty()
    idUsuario:number;

    @ApiProperty()
    email:string;
    @ApiProperty()  
    contraseA:string;
    @ApiProperty()
    token:string;
    

}
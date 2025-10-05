import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario.entity";

@Entity()
export class Auditoria{
    @PrimaryGeneratedColumn("identity")
    id:number;

    @ManyToOne(()=>Usuario,(usuario)=>usuario.idUsuario)
    usuario:Usuario;

    @Column("int")
    idUsuarioModificado:number

    @Column("text")
    fecha:string;
}
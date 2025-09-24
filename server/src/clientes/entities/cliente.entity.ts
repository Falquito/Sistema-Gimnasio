import { ClientesPorServicios } from "src/entities/entities/ClientesPorServicios.entity";
import { Turnos } from "src/entities/entities/Turnos.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cliente {
    @PrimaryGeneratedColumn("identity")
    id_cliente:number;
     @Column("text")
    nombre_cliente:string;

    @Column("text")
    apellido_cliente:string;
    @Column("text")
    telefono_cliente:string;
    @Column("text")
    dni:string;

    @Column("text")
    genero:string;

    @Column("text")
    fecha_alta:string;

    @Column("text")
    fecha_ult_upd:string;
    @Column("float")
    peso:number;
    @Column("float")
    altura:number;
    @Column("text")
    fecha_nacimiento:string;
    @Column("text")
    nivel_fisico:string;
    @Column("text")
    observaciones:string;

    @OneToMany(
        () => ClientesPorServicios,
        (clientesPorServicios) => clientesPorServicios.idServicio,{eager:true}
      )
      clientesPorServicios: ClientesPorServicios[];


    @OneToMany(()=>Turnos,(turnos)=>turnos.idCliente)
    turnos:Turnos[]
}

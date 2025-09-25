// import { ClientesPorServicios } from "src/entities/entities/ClientesPorServicios.entity";
import { Turnos } from "src/entities/entities/Turnos.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Paciente {
    @PrimaryGeneratedColumn("identity")
    id_paciente:number;
     @Column("text")
    nombre_paciente:string;

    @Column("text")
    apellido_paciente:string;
    @Column("text")
    telefono_paciente:string;
    @Column("text")
    dni:string;

    @Column("text")
    genero:string;
    @Column("text")
    fecha_nacimiento:string;
    @Column("text")
    observaciones:string;

    @Column("boolean",{default:true})
    estado:boolean



    // @OneToMany(
    //     () => ClientesPorServicios,
    //     (clientesPorServicios) => clientesPorServicios.idServicio,{eager:true}
    //   )
    //   clientesPorServicios: ClientesPorServicios[];


    @OneToMany(()=>Turnos,(turnos)=>turnos.idPaciente)
    turnos:Turnos[]

    
}

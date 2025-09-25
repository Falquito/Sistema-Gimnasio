// import { ClientesPorServicios } from "src/entities/entities/ClientesPorServicios.entity";
import { ObraSocial } from "src/entities/entities/ObraSocial.entity";
import { Turnos } from "src/entities/entities/Turnos.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @Column("text",{default:"",nullable:true})
    email:string;

    @Column("int",{nullable:true})
    nro_obrasocial:number;



    // @OneToMany(
    //     () => ClientesPorServicios,
    //     (clientesPorServicios) => clientesPorServicios.idServicio,{eager:true}
    //   )
    //   clientesPorServicios: ClientesPorServicios[];


    @OneToMany(()=>Turnos,(turnos)=>turnos.idPaciente)
    turnos:Turnos[]

    @ManyToOne(()=>ObraSocial,(obraSocial)=>obraSocial.paciente,{eager:true})
    obraSocial:ObraSocial

    
} 

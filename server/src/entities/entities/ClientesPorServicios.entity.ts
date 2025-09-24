import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Servicio } from "./Servicio.entity";

import {Cliente} from '../../clientes/entities/cliente.entity'

@Entity("clientes_por_servicios", { schema: "public" })
export class ClientesPorServicios {
  @PrimaryGeneratedColumn("identity",{name:"id"})
  id: number;

  @ManyToOne(()=>Cliente,(cliente)=>cliente.clientesPorServicios)
  
  idCliente: Cliente;

  @ManyToOne(() => Servicio, (servicio) => servicio.clientesPorServicios)
  @JoinColumn([{ name: "id_servicio", referencedColumnName: "idServicio" }])
  idServicio: Servicio;
}

import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Servicio } from "./Servicio.entity";

@Entity("clientes_por_servicios", { schema: "public" })
export class ClientesPorServicios {
  @PrimaryGeneratedColumn("identity",{name:"id"})
  id: number;

  @Column("integer", { name: "id_cliente", nullable: true })
  idCliente: number | null;

  @ManyToOne(() => Servicio, (servicio) => servicio.clientesPorServicios)
  @JoinColumn([{ name: "id_servicio", referencedColumnName: "idServicio" }])
  idServicio: Servicio;
}

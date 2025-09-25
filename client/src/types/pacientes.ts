export interface Paciente {
  id_paciente: number;
  nombre_paciente: string;
  apellido_paciente: string;
  telefono_paciente?: string;
  dni?: string;
  fecha_nacimiento?:string
}

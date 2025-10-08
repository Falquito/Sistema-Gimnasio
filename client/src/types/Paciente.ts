export interface Paciente {
    id_paciente: number;
    nombre: string;
    apellido: string;
    fecha_nacimiento?: string;
    genero?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    diagnostico?: string;
    fecha_alta?: string;
    ultimaConsulta?: string; // ✅ agregar esta línea

    estado?: "activo" | "inactivo";
}

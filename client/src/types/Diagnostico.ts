export interface Diagnostico {
  id_diagnostico: number;
  id_paciente: number;
  fecha: string;
  estado: string;
  certeza: string;
  codigo_cie: string;
  sintomas_principales: string;
}

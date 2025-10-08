export interface JwtPayload {
  sub?: number;           // opcional, pero recomendable usar `sub` (sujeto / subject)
  id?: number;            // si seguís usando `id`, ok
  rol: string;
  nombre: string;
  professionalId?: number | null;
  idProfesional:number;
  // + otros campos que quieras guardar
}

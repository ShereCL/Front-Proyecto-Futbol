export interface Standing {
  name: string;
  strength: number;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  pts: number;
}

// Interfaz auxiliar para mostrar la posición
export interface StandingWithPosition extends Standing {
  position: number;
  diferencia: number;
}

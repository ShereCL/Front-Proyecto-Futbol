import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShieldService {
  private shieldsMap: Record<string, string> = {
    realmadrid: 'assets/escudos/realmadrid.png',
    fcbarcelona: 'assets/escudos/fcbarcelona.png',
    atleticomadrid: 'assets/escudos/atletico.png',
    realsociedad: 'assets/escudos/realsociedad.png',
    villarreal: 'assets/escudos/villarreal.png',
    realbetis: 'assets/escudos/betis.png',
    athleticclub: 'assets/escudos/athletic.png',
    sevillafc: 'assets/escudos/sevilla.png',
    osasuna: 'assets/escudos/osasuna.png',
    gironafc: 'assets/escudos/girona.png',
    rayovallecano: 'assets/escudos/rayo.png',
    celtadevigo: 'assets/escudos/celta.png',
    valenciacf: 'assets/escudos/valencia.png',
    getafecf: 'assets/escudos/getafe.png',
    rcdmallorca: 'assets/escudos/mallorca.png',
    udlaspalmas: 'assets/escudos/laspalmas.png',
    deportivoalaves: 'assets/escudos/alaves.png',
    granadacf: 'assets/escudos/granada.png',
    cadizcf: 'assets/escudos/cadiz.png',
    udalmeria: 'assets/escudos/almeria.png',
  };

  constructor() {}

  getShield(teamName: string): string {
    if (!teamName) return 'assets/escudos/betis.png';

    // Normalizamos el nombre: minúsculas + quitar acentos + quitar espacios
    const key = teamName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quita acentos
      .replace(/\s+/g, ''); // Quita espacios

    return this.shieldsMap[key] || 'assets/escudos/betis.png';
  }
}

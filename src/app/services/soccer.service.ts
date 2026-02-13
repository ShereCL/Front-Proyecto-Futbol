import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Match } from '../model/match.model';
import { environment } from 'src/environments/environment';
import { Standing } from '../model/standing.model';
import { Player } from '../model/player.model';

@Injectable({
  providedIn: 'root',
})
export class SoccerService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  //Partidos de la jornada actual
  getMatches() {
    return this.http.get<Match[]>(`${this.apiUrl}/api/matches`);
  }

  //Tabla de clasificación
  getStandings() {
    return this.http.get<Standing[]>(`${this.apiUrl}/api/standings`);
  }

  //Jugadores de un equipo
  getTeamPlayers(teamName: string) {
    return this.http.get<Player[]>(
      `${this.apiUrl}/api/teams/${teamName}/players`,
    );
  }
}

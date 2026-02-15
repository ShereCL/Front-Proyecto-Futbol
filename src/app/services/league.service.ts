import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Standing, StandingWithPosition } from '../model/standing.model';
import { Player } from '../model/player.model';

@Injectable({
  providedIn: 'root',
})
export class LeagueService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener la clasificación de la liga
  getStandings(): Observable<StandingWithPosition[]> {
    return this.http
      .get<Standing[]>(`${this.apiUrl}/api/league/standings`)
      .pipe(
        map((standings) =>
          standings.map((team, index) => ({
            ...team,
            position: index + 1,
            diferencia: team.gf - team.gc,
          })),
        ),
      );
  }

  // Obtener los jugadores de un equipo específico
  getTeamPlayers(teamName: string): Observable<Player[]> {
    return this.http.get<Player[]>(
      `${this.apiUrl}/api/teams/${encodeURIComponent(teamName)}/players`,
    );
  }

  // Obtener los máximos goleadores de la liga
  getTopScorers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/api/players/top-scorers`);
  }
}

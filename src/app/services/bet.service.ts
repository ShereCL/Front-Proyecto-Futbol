import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Bet } from '../model/bet.model';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class BetService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  //apostar
  placeBet(bet: {
    matchId: number;
    homeScore: number;
    awayScore: number;
  }): Observable<Bet> {
    return from(this.getUserId()).pipe(
      switchMap((userId) => {
        return this.http.post<Bet>(`${this.apiUrl}/api/bets`, {
          userId,
          matchId: bet.matchId,
          homeScore: bet.homeScore,
          awayScore: bet.awayScore,
        });
      }),
    );
  }

  //oapuestas para un partido
  getBetForMatch(matchId: number): Observable<Bet | null> {
    return from(this.getUserId()).pipe(
      switchMap((userId) =>
        this.http
          .get<Bet[]>(`${this.apiUrl}/api/bets/user/${userId}`)
          .pipe(
            map(
              (bets: Bet[]) => bets.find((b) => b.matchId === matchId) || null,
            ),
          ),
      ),
    );
  }

  //obtener apuestas del usuario
  getUserBets(): Observable<Bet[]> {
    return from(this.getUserId()).pipe(
      switchMap((userId) =>
        this.http.get<Bet[]>(`${this.apiUrl}/api/bets/user/${userId}`),
      ),
    );
  }

  //obtener id del usuario
  private async getUserId(): Promise<number> {
    const result = await Preferences.get({ key: 'user' });
    if (result.value) {
      const storedData = JSON.parse(result.value);
      const userData = storedData.user || storedData;

      if (!userData.id) {
        throw new Error('No se encontró el ID del usuario');
      }

      return userData.id;
    }
    throw new Error('Usuario no autenticado');
  }
}

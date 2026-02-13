import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Bet } from '../model/bet.model';

@Injectable({
  providedIn: 'root',
})
export class BetService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  //Enviar apuesta (con token)
  placeBet(bet: {
    matchId: number;
    homeScore: number;
    awayScore: number;
    amount: number;
  }) {
    return this.http.post<Bet>(`${this.apiUrl}/bets`, bet);
  }
}

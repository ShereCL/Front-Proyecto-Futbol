import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  //Este servicio es para obtener la tabla de clasificación de los usuarios, con sus puntos y sus cosas
  getLeaderboard(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/api/leaderboard`);
  }
}

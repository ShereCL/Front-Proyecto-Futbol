import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Message } from '../model/chat-message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  //recibir mensajes
  getMessages(matchId: number): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${environment.apiUrl}/api/messages/${matchId}`,
    );
  }

  //enviar mensaje
  sendMessage(
    matchId: number,
    username: string,
    text: string,
  ): Observable<Message> {
    const payload = {
      matchId: matchId,
      username: username,
      text: text,
    };

    return this.http.post<Message>(
      `${environment.apiUrl}/api/messages`,
      payload,
    );
  }

  //cada cinco segundos se actualiza el chat
  getMessagesPolling(matchId: number): Observable<Message[]> {
    return interval(5000).pipe(
      startWith(0),
      switchMap(() => this.getMessages(matchId)),
    );
  }
}

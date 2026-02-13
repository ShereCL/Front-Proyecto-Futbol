// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ChatMessage } from '../model/chat-message.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener mensajes de un partido
  getMessages(matchId: number) {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/messages/${matchId}`);
  }

  // Enviar mensaje
  sendMessage(matchId: number, message: { text: string }) {
    return this.http.post<ChatMessage>(
      `${this.apiUrl}/messages/${matchId}`,
      message,
    );
  }
}

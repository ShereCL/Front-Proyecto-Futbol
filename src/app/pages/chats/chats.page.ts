import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/model/chat-message.model';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class ChatsPage implements OnInit, OnDestroy {
  @ViewChild('chatContent') chatContent!: ElementRef;

  matchId!: number;
  username: string = '';
  matchTitle: string = '';
  messages: Message[] = [];
  newMessage: string = '';
  loading = true;
  sending = false;

  private pollingSubscription?: Subscription;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}

  async ngOnInit() {
    // aqui se obtiene el id del match de la ruta
    const id = this.route.snapshot.paramMap.get('matchId');
    if (id) {
      this.matchId = parseInt(id);
      this.loadMessages();
    }

    // traigo el nombre del usuario del service
    try {
      const currentUser = await this.authService.getCurrentUser();
      this.username = currentUser?.username || 'Usuario';
    } catch (error) {
      this.username = 'Usuario';
    }

    // obtengo el titulo del partido
    const title = this.route.snapshot.queryParamMap.get('title');
    this.matchTitle = title || 'Chat del Partido';
  }

  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  loadMessages() {
    this.loading = true;
    // esto es para que se actualicen los mensajes automáticamente
    this.pollingSubscription = this.chatService
      .getMessagesPolling(this.matchId)
      .subscribe({
        next: (data) => {
          const previousLength = this.messages.length;
          this.messages = data;
          this.loading = false;

          // solo hacer scroll si hay nuevos mensajes
          if (data.length > previousLength) {
            setTimeout(() => this.scrollToBottom(), 100);
          }
        },
        error: (err) => {
          this.loading = false;
        },
      });
  }

  sendMessage() {
    if (!this.newMessage.trim() || this.sending) return;

    this.sending = true;
    this.chatService
      .sendMessage(this.matchId, this.username, this.newMessage.trim())
      .subscribe({
        next: (message) => {
          this.newMessage = '';
          this.sending = false;
        },
        error: (err) => {
          this.sending = false;
        },
      });
  }

  scrollToBottom() {
    if (this.chatContent) {
      this.chatContent.nativeElement.scrollTop =
        this.chatContent.nativeElement.scrollHeight;
    }
  }

  isMyMessage(message: Message): boolean {
    return message.username === this.username;
  }
}

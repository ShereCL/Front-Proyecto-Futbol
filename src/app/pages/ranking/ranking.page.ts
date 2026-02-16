import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';
import { AvatarService } from '../../services/avatar.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonCard,
  IonAvatar,
  IonIcon,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
  imports: [
    CommonModule,
    IonItem,
    IonList,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonIcon,
    IonAvatar,
    IonCard,
    IonToolbar,
    IonContent,
    IonSpinner,
    IonHeader,
    IonTitle,
  ],
})
export class RankingPage implements OnInit {
  users: User[] = [];
  loading = true;

  constructor(
    private userService: UserService,
    private avatarService: AvatarService,
  ) {}

  ngOnInit() {
    this.loadLeaderboard();
  }

  // Carga el ranking de los usuarios
  loadLeaderboard() {
    this.loading = true;
    this.userService.getLeaderboard().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  getUserAvatar(user: User): string {
    if (user.avatarUrl) {
      return user.avatarUrl;
    }
    const seed = user.username || user.email || 'User';
    return this.avatarService.generateAvatarUrl(seed, 'bottts');
  }

  onImageError(event: Event, user: User) {
    const img = event.target as HTMLImageElement;
    const seed = user.username || user.email || 'User';
    img.src = this.avatarService.generateAvatarUrl(seed, 'bottts');
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SoccerService } from '../../services/soccer.service';
import { ShieldService } from '../../services/shield.service';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonSpinner,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonBadge,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.page.html',
  styleUrls: ['./team-detail.page.scss'],
  imports: [
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    IonCard,
    IonIcon,
    CommonModule,
    IonSpinner,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonItem,
    IonList,
    IonAvatar,
    IonLabel,
    IonBadge,
    IonContent,
    IonTitle,
  ],
})
export class TeamDetailPage implements OnInit {
  teamName!: string;
  players: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private soccerService: SoccerService,
    private shieldService: ShieldService,
  ) {}

  ngOnInit() {
    this.teamName = decodeURIComponent(
      this.route.snapshot.paramMap.get('name') || '',
    );
    this.loadPlayers();
  }

  //cargo los jugadores
  loadPlayers() {
    this.loading = true;
    this.soccerService.getTeamPlayers(this.teamName).subscribe({
      next: (players) => {
        this.players = players;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  //los goles
  getTotalGoals(): number {
    return this.players.reduce((sum, player) => sum + (player.goals || 0), 0);
  }

  //el escudo del equipo
  getTeamShield(teamName: string): string {
    return this.shieldService.getShield(teamName);
  }

  //error al cargar la imagen meto el del betis por defecto
  onImageError(event: any): void {
    event.target.src = 'assets/escudos/betis.png';
  }
}

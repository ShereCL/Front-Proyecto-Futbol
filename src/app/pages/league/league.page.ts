import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonIcon,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trophyOutline,
  footballOutline,
  chevronForwardOutline,
  refreshOutline,
  podiumOutline,
  informationCircleOutline,
  star,
  starHalf,
  arrowDown,
  trophy,
} from 'ionicons/icons';
import { ShieldService } from 'src/app/services/shield.service';
import { StandingWithPosition } from 'src/app/model/standing.model';
import { LeagueService } from 'src/app/services/league.service';

@Component({
  selector: 'app-league',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonIcon,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
  ],
  templateUrl: './league.page.html',
  styleUrls: ['./league.page.scss'],
})
export class LeaguePage implements OnInit {
  standings: StandingWithPosition[] = [];
  loading = true;

  constructor(
    private leagueService: LeagueService,
    private shieldService: ShieldService,
    private router: Router,
  ) {
    addIcons({
      trophy,
      podiumOutline,
      chevronForwardOutline,
      informationCircleOutline,
      star,
      starHalf,
      arrowDown,
      trophyOutline,
      footballOutline,
      refreshOutline,
    });
  }

  ngOnInit() {
    this.loadStandings();
  }

  //cargo la clasificacion
  loadStandings() {
    this.loading = true;
    this.leagueService.getStandings().subscribe({
      next: (standings) => {
        this.standings = standings;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  //refresca la clasificacion
  handleRefresh(event: any) {
    this.leagueService.getStandings().subscribe({
      next: (standings) => {
        this.standings = standings;
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      },
    });
  }

  //obtengo el escudo del equipo
  getTeamShield(teamName: string): string {
    return this.shieldService.getShield(teamName);
  }

  //cambio la imagen del escudo por defecto si no se carga
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/escudos/betis.png';
  }

  //obtengo el color del equipo
  getPositionColor(position: number): string {
    if (position <= 4) return 'success';
    if (position === 5) return 'primary';
    if (position === 6) return 'secondary';
    if (position >= 18) return 'danger';
    return 'medium';
  }

  //obtengo el badge del equipo segun la posicion, con iconitos chulos pra marcar que es lider, en descenso...
  getPositionBadge(position: number): string {
    if (position <= 4) return '🏆';
    if (position === 5) return '⭐';
    if (position === 6) return '✨';
    if (position >= 18) return '⬇️';
    return '';
  }
  //detalles del equipo, para ver la plantilla y los goles que ha marcado cada uno
  viewTeamDetail(team: StandingWithPosition) {
    this.router.navigate(['/team', team.name]);
  }
}

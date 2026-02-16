import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoccerService } from 'src/app/services/soccer.service';
import { ShieldService } from 'src/app/services/shield.service';
import { Match } from 'src/app/model/match.model';
import { addIcons } from 'ionicons';
import {
  IonContent,
  IonBadge,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import {
  footballOutline,
  timeOutline,
  cashOutline,
  calendarOutline,
  listOutline,
  ellipseOutline,
  swapHorizontalOutline,
  squareOutline,
  radioOutline,
  chevronForwardOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, IonContent, IonBadge, IonButton, IonIcon, IonSpinner],
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
})
export class MatchesPage implements OnInit {
  matches: Match[] = [];
  loading = true;

  constructor(
    private soccerService: SoccerService,
    private shieldService: ShieldService,
    private router: Router,
  ) {
    addIcons({
      footballOutline,
      radioOutline,
      timeOutline,
      listOutline,
      chevronForwardOutline,
      calendarOutline,
      cashOutline,
      ellipseOutline,
      swapHorizontalOutline,
      squareOutline,
      checkmarkCircleOutline,
    });
  }

  ngOnInit() {
    this.loadMatches();
    setInterval(() => this.loadMatches(), 20000);
  }

  //cargar los partidos
  loadMatches() {
    this.soccerService.getMatches().subscribe({
      next: (data) => {
        this.matches = data.map((match) => ({
          ...match,
          homeShield: this.shieldService.getShield(match.home),
          awayShield: this.shieldService.getShield(match.away),
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando partidos', err);
        this.loading = false;
      },
    });
  }

  //obtener el color del estado dependiendo de en que estado se encuentra el partido
  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'live':
        return 'danger';
      case 'finished':
        return 'medium';
      default:
        return 'medium';
    }
  }

  //lo mismo pero para el texto
  getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'Próximamente';
      case 'live':
        return 'En Vivo';
      case 'finished':
        return 'Finalizado';
      default:
        return status;
    }
  }

  //funcion para ir a la pantalla de apuestas
  onBet(match: Match) {
    console.log('Apostar en partido:', match);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/escudos/betis.png';
  }

  //funcion para obtener el escudo de un equipo
  getTeamShield(teamName: string): string {
    return this.shieldService.getShield(teamName);
  }

  //iconos de los eventos (básicamente los goles por que el resto no se usa, quería meter tarjetas y demás pero no me dio tiempo)
  getEventIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'goal':
        return 'football-outline';
      case 'yellow-card':
        return 'square-outline';
      case 'red-card':
        return 'square-outline';
      case 'substitution':
        return 'swap-horizontal-outline';
      default:
        return 'ellipse-outline';
    }
  }

  //esta es para el texto de un evento
  getEventText(type: string): string {
    switch (type.toLowerCase()) {
      case 'goal':
        return 'Gol';
      case 'yellow-card':
        return 'Tarjeta Amarilla';
      case 'red-card':
        return 'Tarjeta Roja';
      case 'substitution':
        return 'Cambio';
      default:
        return type;
    }
  }

  //color del evento
  getEventColor(team: string, homeTeam: string): string {
    return team === homeTeam ? 'warning' : 'success';
  }

  //ir a la pantalla de detalle de un partido
  goToMatchDetail(matchId: number) {
    this.router.navigate(['/matches', matchId]);
  }

  //icono del estado
  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending':
        return 'time-outline';
      case 'live':
        return 'radio-outline';
      case 'finished':
        return 'checkmark-circle-outline';
      default:
        return 'ellipse-outline';
    }
  }
}

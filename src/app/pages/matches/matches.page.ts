// src/app/pages/matches.page/matches.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoccerService } from 'src/app/services/soccer.service';
import { ShieldService } from 'src/app/services/shield.service';
import {
  IonContent,
  IonBadge,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { Match } from 'src/app/model/match.model';
import { addIcons } from 'ionicons';
import {
  footballOutline,
  timeOutline,
  cashOutline,
  calendarOutline,
  listOutline,
  ellipseOutline,
  swapHorizontalOutline,
  squareOutline,
} from 'ionicons/icons';

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
  ) {
    addIcons({
      footballOutline,
      timeOutline,
      cashOutline,
      calendarOutline,
      listOutline,
      ellipseOutline,
      swapHorizontalOutline,
      squareOutline,
    });
  }

  ngOnInit() {
    this.loadMatches();
    // Refresco cada 20 segundos para ver cambios en vivo
    setInterval(() => this.loadMatches(), 20000);
  }

  loadMatches() {
    this.soccerService.getMatches().subscribe({
      next: (data) => {
        // Agregar escudos a cada partido
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

  // Devuelve color para el estado del partido (tengo que cmbiar estos colores )
  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'medium';
      case 'live':
        return 'danger';
      case 'finished':
        return 'success';
      default:
        return 'light';
    }
  }

  // Devuelve texto del estado del partido
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

  // Manejador para cuando se hace clic en apostar
  onBet(match: Match) {
    console.log('Apostar en partido:', match);
    // en algun momento aqui la logica de las apuestas
  }

  // Manejador para errores de carga de imagen
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/escudos/betis.png';
  }

  /*Obtener icono según el tipo de evento
  getEventIcon(eventType: string): string {
    switch (eventType.toLowerCase()) {
      case 'goal':
        return 'football-outline';
      case 'yellow-card':
      case 'yellowcard':
        return 'square-outline';
      case 'red-card':
      case 'redcard':
        return 'square-outline';
      case 'substitution':
      case 'substitute':
        return 'swap-horizontal-outline';
      default:
        return 'ellipse-outline';
    }
  } 

  // Obtener texto del evento
  getEventText(eventType: string): string {
    switch (eventType.toLowerCase()) {
      case 'goal':
        return 'Gol';
      case 'yellow-card':
      case 'yellowcard':
        return 'Tarjeta Amarilla';
      case 'red-card':
      case 'redcard':
        return 'Tarjeta Roja';
      case 'substitution':
      case 'substitute':
        return 'Cambio';
      default:
        return eventType;
    }
  }*/

  //con este método obtengo el escudo del equipo

  getTeamShield(teamName: string): string {
    return this.shieldService.getShield(teamName);
  }
}

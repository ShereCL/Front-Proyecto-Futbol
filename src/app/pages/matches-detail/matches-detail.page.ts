import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  AlertController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  footballOutline,
  cashOutline,
  listOutline,
  arrowBackOutline,
  checkmarkCircleOutline,
  informationCircleOutline,
  football,
  squareOutline,
  swapHorizontalOutline,
  ellipseOutline,
  alertCircleOutline,
  calendarOutline,
  trophyOutline,
  star,
  chatbubbles,
  peopleOutline,
  chevronForward,
} from 'ionicons/icons';
import { SoccerService } from 'src/app/services/soccer.service';
import { ShieldService } from 'src/app/services/shield.service';
import { BetService } from 'src/app/services/bet.service';
import { Match } from 'src/app/model/match.model';

@Component({
  selector: 'app-matches-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonSpinner,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
  ],
  templateUrl: './matches-detail.page.html',
  styleUrls: ['./matches-detail.page.scss'],
})
export class MatchesDetailPage implements OnInit {
  match: Match | null = null;
  loading = true;

  // formulario para la apuesta
  awayScore: number = 0;
  hasBet: boolean = false;
  isBetting: boolean = false;
  homeScore: number = 0;

  constructor(
    private route: ActivatedRoute,
    private soccerService: SoccerService,
    private shieldService: ShieldService,
    private betService: BetService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    addIcons({
      arrowBackOutline,
      footballOutline,
      calendarOutline,
      checkmarkCircleOutline,
      trophyOutline,
      star,
      chatbubbles,
      peopleOutline,
      chevronForward,
      listOutline,
      alertCircleOutline,
      informationCircleOutline,
      cashOutline,
      football,
      squareOutline,
      swapHorizontalOutline,
      ellipseOutline,
    });
  }

  ngOnInit() {
    const matchId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMatch(matchId);
    this.checkExistingBet(matchId);
  }

  //carga detalles del partido
  loadMatch(id: number) {
    this.soccerService.getMatches().subscribe({
      next: (matches) => {
        this.match = matches.find((m) => m.id === id) || null;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.showToast('Error al cargar el partido', 'danger');
      },
    });
  }

  checkExistingBet(matchId: number) {
    this.betService.getBetForMatch(matchId).subscribe({
      next: (bet) => {
        if (bet) {
          this.hasBet = true;
          this.homeScore = bet.homeScore;
          this.awayScore = bet.awayScore;
        }
      },
      error: () => {
        this.hasBet = false;
      },
    });
  }

  canBet(): boolean {
    return this.match?.status === 'pending' && !this.hasBet;
  }

  //enviar apuesta
  async submitBet() {
    if (!this.match) return;

    // Validaciones
    if (this.homeScore < 0 || this.awayScore < 0) {
      this.showToast('Los goles no pueden ser negativos', 'warning');
      return;
    }

    if (this.homeScore > 20 || this.awayScore > 20) {
      this.showToast('Máximo 20 goles por equipo', 'warning');
      return;
    }

    const alert = await this.alertController.create({
      header: '⚽ Confirmar Pronóstico',
      message: `${this.match.home} ${this.homeScore} - ${this.awayScore} ${this.match.away}`,
      cssClass: 'bet-alert-premium',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-btn-cancel',
        },
        {
          text: 'Confirmar Apuesta',
          cssClass: 'alert-btn-confirm',
          handler: () => {
            this.confirmBet();
          },
        },
      ],
    });

    await alert.present();
  }

  //confirmar apuesta
  confirmBet() {
    if (!this.match) return;

    this.isBetting = true;

    const betData = {
      matchId: this.match.id,
      homeScore: this.homeScore,
      awayScore: this.awayScore,
    };

    this.betService.placeBet(betData).subscribe({
      next: (response) => {
        this.hasBet = true;
        this.isBetting = false;
        this.showToast('¡Apuesta realizada con éxito! 🎯', 'success');
      },
      error: (error) => {
        this.isBetting = false;
        const errorMsg = error.error?.message || 'Error al realizar la apuesta';
        this.showToast(errorMsg, 'danger');
      },
    });
  }

  //mostrar toast de error o exito
  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top',
      cssClass: 'custom-toast toast-' + color,
    });
    await toast.present();
  }

  getTeamShield(teamName: string): string {
    return this.shieldService.getShield(teamName);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/escudos/betis.png';
  }

  getStatusText(status: string | undefined): string {
    switch (status) {
      case 'pending':
        return 'Próximamente';
      case 'live':
        return 'En Vivo';
      case 'finished':
        return 'Finalizado';
      default:
        return status || '';
    }
  }

  getStatusBadgeColor(status: string | undefined): string {
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

  getEventIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'goal':
        return 'football';
      case 'yellow-card':
      case 'red-card':
        return 'square-outline';
      case 'substitution':
        return 'swap-horizontal-outline';
      default:
        return 'ellipse-outline';
    }
  }

  getEventIconColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'goal':
        return 'success';
      case 'yellow-card':
        return 'warning';
      case 'red-card':
        return 'danger';
      default:
        return 'medium';
    }
  }

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

  //regresar a los partidos
  goBack() {
    this.router.navigate(['/tabs/matches']);
  }

  //depende del estado traigo los iconos
  getStatusIcon(status: string | undefined): string {
    switch (status) {
      case 'pending':
        return 'calendar-outline';
      case 'live':
        return 'radio-outline';
      case 'finished':
        return 'checkmark-circle-outline';
      default:
        return 'ellipse-outline';
    }
  }
  //abrir el chat
  openChat() {
    if (!this.match) return;

    const matchTitle = `${this.match.home} vs ${this.match.away}`;

    this.router.navigate(['/chats', this.match.id], {
      queryParams: { title: matchTitle },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonButton,
  IonAvatar,
  IonLabel,
  IonBadge,
  IonList,
  IonItem,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
  AlertController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  logOutOutline,
  mailOutline,
  trophyOutline,
  footballOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  timeOutline,
  statsChartOutline,
  ribbonOutline,
  personCircleOutline,
  camera,
  chevronForwardOutline,
  trophy,
  football,
} from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { BetService } from 'src/app/services/bet.service';
import { ShieldService } from 'src/app/services/shield.service';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    RouterLink,
    IonIcon,
    IonButton,
    IonAvatar,
    IonLabel,
    IonBadge,
    IonList,
    IonItem,
    IonSpinner,
    IonSegment,
    IonSegmentButton,
  ],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  currentUser: User | null = null;
  bets: any[] = [];
  loading = true;
  selectedSegment: 'info' | 'bets' | 'stats' = 'info';

  // estadísticas del jugador
  stats = {
    totalBets: 0,
    wonBets: 0,
    lostBets: 0,
    pendingBets: 0,
    winRate: 0,
    totalPoints: 0,
  };

  constructor(
    private authService: AuthService,
    private betService: BetService,
    private shieldService: ShieldService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    addIcons({
      personCircleOutline,
      camera,
      mailOutline,
      trophy,
      personOutline,
      footballOutline,
      statsChartOutline,
      trophyOutline,
      logOutOutline,
      football,
      chevronForwardOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      timeOutline,
      ribbonOutline,
    });
  }

  async ngOnInit() {
    await this.loadUserProfile();
    await this.loadUserBets();
  }

  //cargar perfil del usuario
  async loadUserProfile() {
    try {
      this.currentUser = await this.authService.getCurrentUser();
    } catch (error) {
      console.error('Error cargando perfil:', error);
    }
  }

  //cargar apuestas del usuario
  async loadUserBets() {
    this.loading = true;
    this.betService.getUserBets().subscribe({
      next: (bets) => {
        this.bets = bets;
        this.calculateStats(bets);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  //calcular las estadísticas del usuario
  calculateStats(bets: any[]) {
    this.stats.totalBets = bets.length;
    this.stats.wonBets = bets.filter((b) => b.status === 'win').length;
    this.stats.lostBets = bets.filter((b) => b.status === 'loss').length;
    this.stats.pendingBets = bets.filter((b) => b.status === 'pending').length;
    this.stats.winRate =
      this.stats.totalBets > 0
        ? Math.round((this.stats.wonBets / this.stats.totalBets) * 100)
        : 0;
    this.stats.totalPoints = bets.reduce(
      (sum, bet) => sum + (bet.pointsEarned || 0),
      0,
    );
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  //obtener escudo de la liga
  getTeamShield(teamName: string): string {
    return this.shieldService.getShield(teamName);
  }

  //esto es para cuando la imagen no se carga
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src =
      'https://ui-avatars.com/api/?name=User&background=3880ff&color=fff';
  }

  //estado de la apuesta
  getStatusColor(status: string): string {
    switch (status) {
      case 'win':
        return 'success';
      case 'loss':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'medium';
    }
  }

  //icono de la apuesta
  getStatusIcon(status: string): string {
    switch (status) {
      case 'win':
        return 'checkmark-circle-outline';
      case 'loss':
        return 'close-circle-outline';
      case 'pending':
        return 'time-outline';
      default:
        return 'time-outline';
    }
  }

  //texto de la apuesta
  getStatusText(status: string): string {
    switch (status) {
      case 'win':
        return 'Acertada';
      case 'loss':
        return 'Fallada';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  }

  //ver detalle de la apuesta
  viewMatchDetail(bet: any) {
    if (bet.match?.id) {
      this.router.navigate(['/matches', bet.match.id]);
    }
  }

  //cerrar sesion
  async handleLogout() {
    const alert = await this.alertController.create({
      cssClass: 'bet-alert-premium',
      header: '¿Cerrar sesión?',
      message: '¿Estás seguro de que quieres salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Salir',
          cssClass: 'alert-button-confirm',
          handler: async () => {
            await this.authService.logout();
            this.router.navigate(['/login']);
          },
        },
      ],
    });

    await alert.present();
  }
}

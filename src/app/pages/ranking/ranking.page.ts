import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { podiumOutline } from 'ionicons/icons';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonIcon,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          <ion-icon name="podium-outline"></ion-icon>
          Ranking de Usuarios
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <div class="placeholder">
        <ion-card>
          <ion-card-content>
            <div class="coming-soon">
              <ion-icon name="podium-outline" color="primary"></ion-icon>
              <h2>Ranking de Usuarios</h2>
              <p>Esta funcionalidad estará disponible próximamente</p>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .placeholder {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        padding: 20px;
      }

      .coming-soon {
        text-align: center;
        padding: 40px 20px;

        ion-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }

        h2 {
          color: var(--ion-color-dark);
          margin-bottom: 10px;
        }

        p {
          color: var(--ion-color-medium);
        }
      }
    `,
  ],
})
export class RankingPage implements OnInit {
  constructor() {
    addIcons({ podiumOutline });
  }

  ngOnInit() {
    console.log('Ranking page loaded');
  }
}

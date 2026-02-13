// src/app/pages/login.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonLabel,
  IonItem,
  IonButton,
  IonInput,
  IonIcon,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  lockClosedOutline,
  alertCircleOutline,
  arrowForwardOutline,
  footballOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-login.page',
  templateUrl: './login.page.page.html',
  styleUrls: ['./login.page.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonLabel,
    IonItem,
    IonButton,
    IonInput,
    IonIcon,
    RouterLink,
  ],
})
export class LoginPagePage {
  loginForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    // Registrar iconos
    addIcons({
      'mail-outline': mailOutline,
      'lock-closed-outline': lockClosedOutline,
      'alert-circle-outline': alertCircleOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'football-outline': footballOutline,
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onLogin() {
    this.error = null;
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    try {
      await this.authService.login(email, password);
      // navegar a la pagina de partidos, la pagina principal
      this.router.navigate(['/matches']);
    } catch (error: any) {
      this.error = error.message || 'Error al iniciar sesión';
    }
  }
}

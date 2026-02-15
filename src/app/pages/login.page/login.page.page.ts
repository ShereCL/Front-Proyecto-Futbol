import { Component, OnInit } from '@angular/core';
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
  trophy,
  logInOutline,
  helpCircleOutline,
  people,
  personAddOutline,
  football,
} from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';

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
export class LoginPagePage implements OnInit {
  loginForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    // Registrar iconos
    addIcons({
      trophy,
      logInOutline,
      mailOutline,
      lockClosedOutline,
      alertCircleOutline,
      footballOutline,
      arrowForwardOutline,
      helpCircleOutline,
      people,
      football,
      personAddOutline,
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // si el usuario ya esta logueado, lo redirige a la pagina de partidos
  async ngOnInit() {
    const { value: token } = await Preferences.get({ key: 'token' });

    if (token) {
      this.router.navigateByUrl('/matches', { replaceUrl: true });
    }
  }

  async onLogin() {
    this.error = null;
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    try {
      await this.authService.login(email, password);
      // navegar a la pagina de partidos, la pagina principal
      this.router.navigate(['/tabs/matches']);
    } catch (error: any) {
      this.error = error.message || 'Error al iniciar sesión';
    }
  }
}

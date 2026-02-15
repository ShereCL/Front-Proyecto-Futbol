import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonIcon,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { AvatarService } from 'src/app/services/avatar.service';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  lockClosedOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  informationCircleOutline,
  footballOutline,
  people,
  shieldCheckmarkOutline,
  documentTextOutline,
  personAddOutline,
  trophy,
  statsChart,
  heart,
  logInOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-register.page',
  templateUrl: './register.page.page.html',
  styleUrls: ['./register.page.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonLabel,
    IonItem,
    IonList,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonInput,
    IonIcon,
    RouterLink,
  ],
})
export class RegisterPagePage implements OnInit {
  registerForm: FormGroup;
  error: string | null = null;
  avatarPreview: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private avatarService: AvatarService,
    private router: Router,
  ) {
    // Registrar iconos
    addIcons({
      people,
      shieldCheckmarkOutline,
      personOutline,
      informationCircleOutline,
      mailOutline,
      lockClosedOutline,
      alertCircleOutline,
      documentTextOutline,
      personAddOutline,
      checkmarkCircleOutline,
      trophy,
      statsChart,
      heart,
      logInOutline,
      footballOutline: footballOutline,
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    // Avatar por defecto
    this.updateAvatarPreview();
  }

  // Actualizar preview del avatar cuando cambia username o email
  onUsernameChange() {
    this.updateAvatarPreview();
  }

  onEmailChange() {
    this.updateAvatarPreview();
  }

  updateAvatarPreview() {
    const username = this.registerForm.get('username')?.value || '';
    const email = this.registerForm.get('email')?.value || '';
    const seed = username || email || 'default-user';

    this.avatarPreview = this.avatarService.generateUserAvatar(seed, seed);
  }

  async onRegister() {
    this.error = null;
    if (this.registerForm.invalid) {
      return;
    }

    const { username, email, password } = this.registerForm.value;

    try {
      await this.authService.register(username, email, password);
      this.router.navigate(['/matches']);
    } catch (error: any) {
      this.error = JSON.stringify(error) || 'Error al registrar el usuario';
      console.error('Registration error:', error);
    }
  }

  // Método para calcular la fuerza de la contraseña
  getPasswordStrength(): 'weak' | 'medium' | 'strong' {
    const password = this.registerForm.get('password')?.value || '';
    if (password.length === 0) return 'weak';

    let strength = 0;

    // Longitud
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;

    // Tiene números
    if (/\d/.test(password)) strength++;

    // Tiene mayúsculas
    if (/[A-Z]/.test(password)) strength++;

    // Tiene caracteres especiales
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    const texts = {
      weak: 'Débil',
      medium: 'Media',
      strong: 'Fuerte',
    };
    return texts[strength];
  }
}

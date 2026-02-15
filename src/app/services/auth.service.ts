// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { Preferences } from '@capacitor/preferences';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AvatarService } from './avatar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private avatarService: AvatarService,
  ) {}

  /* Registro con avatar desde dicebar */
  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const avatarUrl = this.avatarService.generateUserAvatar(username, email);

    // el back devuelve el token junto con el usuario
    const response = await firstValueFrom(
      this.http.post<{ token: string; user: User }>(
        `${this.apiUrl}/api/register`,
        {
          username,
          email,
          password,
          avatarUrl,
        },
      ),
    );

    // Guardar token
    await Preferences.set({ key: 'token', value: response.token });
    await Preferences.set({
      key: 'user',
      value: JSON.stringify(response.user),
    });

    return response.user;
  }

  /* Login */
  async login(email: string, password: string): Promise<User> {
    const response = await firstValueFrom(
      this.http.post<{ token: string; user: User }>(
        `${this.apiUrl}/api/login`,
        {
          email,
          password,
        },
      ),
    );

    // Guardar token
    await Preferences.set({ key: 'token', value: response.token });

    // Guardar solo el usuario
    await Preferences.set({
      key: 'user',
      value: JSON.stringify(response.user),
    });

    return response.user; // devuelve solo el usuario
  }

  /* Logout */
  async logout(): Promise<void> {
    await Preferences.remove({ key: 'token' });
    await Preferences.remove({ key: 'user' });
  }

  /* Obtener token */
  async getToken(): Promise<string | null> {
    const result = await Preferences.get({ key: 'token' });
    return result.value;
  }

  /* Comprobar usuario logueado */
  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  /* Obtener usuario actual (con avatar) */
  async getCurrentUser(): Promise<User | null> {
    const result = await Preferences.get({ key: 'user' });
    if (result.value) {
      return JSON.parse(result.value);
    }
    return null;
  }

  /* Actualizar avatar del usuario */
  async updateUserAvatar(newSeed?: string): Promise<string> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuario no encontrado');
      }

      // Generar nuevo avatar
      const seed = newSeed || currentUser.username + Date.now();
      const newAvatarUrl = this.avatarService.generateAvatarUrl(seed, 'bottts');

      // Actualizar en el backend
      const updatedUser = await firstValueFrom(
        this.http.put<User>(`${this.apiUrl}/api/users/avatar`, {
          avatarUrl: newAvatarUrl,
        }),
      );

      // Actualizar en local storage
      await Preferences.set({
        key: 'user',
        value: JSON.stringify(updatedUser),
      });

      return newAvatarUrl;
    } catch (error) {
      console.error('Error actualizando avatar:', error);
      throw error;
    }
  }

  /* Cambiar estilo de avatar del usuario */
  async changeAvatarStyle(style: string): Promise<string> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuario no encontrado');
      }

      // Generar avatar con nuevo estilo
      const newAvatarUrl = this.avatarService.generateAvatarUrl(
        currentUser.username,
        style as any,
      );

      // Actualizar en el backend
      const updatedUser = await firstValueFrom(
        this.http.put<User>(`${this.apiUrl}/api/users/avatar`, {
          avatarUrl: newAvatarUrl,
        }),
      );

      // Actualizar en local storage
      await Preferences.set({
        key: 'user',
        value: JSON.stringify(updatedUser),
      });

      return newAvatarUrl;
    } catch (error) {
      console.error('Error cambiando estilo de avatar:', error);
      throw error;
    }
  }
}

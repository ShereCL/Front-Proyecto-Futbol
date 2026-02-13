import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // primera pantalla al abrir la app
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login.page/login.page.page').then((m) => m.LoginPagePage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register.page/register.page.page').then(
        (m) => m.RegisterPagePage,
      ),
  },
  {
    path: 'matches',
    loadComponent: () =>
      import('./pages/matches/matches.page').then((m) => m.MatchesPage),
  },
];

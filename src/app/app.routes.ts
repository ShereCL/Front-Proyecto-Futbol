import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
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
    path: 'tabs',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: '',
        redirectTo: 'matches',
        pathMatch: 'full',
      },
      {
        path: 'matches',
        loadComponent: () =>
          import('./pages/matches/matches.page').then((m) => m.MatchesPage),
      },
      {
        path: 'league',
        loadComponent: () =>
          import('./pages/league/league.page').then((m) => m.LeaguePage),
      },
      {
        path: 'ranking',
        loadComponent: () =>
          import('./pages/ranking/ranking.page').then((m) => m.RankingPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.page').then((m) => m.ProfilePage),
      },
    ],
  },

  {
    path: 'matches/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/matches-detail/matches-detail.page').then(
        (m) => m.MatchesDetailPage,
      ),
  },

  {
    path: 'team/:name',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/team-detail/team-detail.page').then(
        (m) => m.TeamDetailPage,
      ),
  },

  {
    path: 'chats/:matchId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/chats/chats.page').then((m) => m.ChatsPage),
  },

  {
    path: 'home',
    redirectTo: 'tabs/matches',
    pathMatch: 'full',
  },

  { path: '**', redirectTo: 'tabs/matches' },
];

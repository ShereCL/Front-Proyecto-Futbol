import { MatchEvent } from './match-event.model';

export type MatchStatus = 'pending' | 'live' | 'finished';

export interface Match {
  matchday: any;
  awayTeam: any;
  homeTeam: any;
  awayShield: any;
  homeShield: any;
  id: number;
  jornada: number;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: MatchStatus;
  time: string;
  league: string;
  events: MatchEvent[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  points: number;
  avatarUrl?: string;
  token?: string;
}

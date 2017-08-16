import {User} from '../models/User';

export interface ApiService {
  username: string;
  password: string;
  isLoggedIn: boolean;
  loginError: string;
  fetch<T>(path: string, opt?: RequestInit): Promise<T>;
  create<T>(path: string, opt?: RequestInit): Promise<T>;
  read<T>(path: string, opt?: RequestInit): Promise<T>;
  update<T>(path: string, opt?: RequestInit): Promise<T>;
  login(username: string, password: string): void;
  logout(): void;
  onLogin(fn: (u: User) => void): void;
  onSocketConnection(fn: (s: SocketIOClient.Socket) => void): void;
}

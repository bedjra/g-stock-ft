// SERVICE/mock-users.ts
import { Utilisateur } from './login-service';

export const MOCK_USERS: Utilisateur[] = [
  { id: 1, email: 'admin@gstock.com', password: '1234', role: 'ADMIN' },
  { id: 2, email: 'user@gstock.com', password: 'user123', role: 'USER' },
  { id: 3, email: 'manager@gstock.com', password: 'manager123', role: 'MANAGER' },
];
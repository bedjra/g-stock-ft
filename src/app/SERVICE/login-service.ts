import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Utilisateur {
  id?: number;
  email: string;
  password: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // 🔹 Login
  login(credentials: { email: string; password: string }): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.baseUrl}/user/login`, credentials);
  }

  // 🔹 Récupérer tous les utilisateurs
  getAllUsers(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.baseUrl}/user`);
  }

  // 🔹 Récupérer les rôles disponibles
  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/user/roles`);
  }

  // 🔹 Récupérer le rôle d’un utilisateur via email
  getRoleByEmail(email: string): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/user/role/${email}`);
  }

  // 🔹 Récupérer l’utilisateur connecté
  getCurrentUser(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.baseUrl}/user/info`);
  }

  // 🔹 Modifier un utilisateur
  updatUser(id: number, data: { email: string; password: string; role: string }): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.baseUrl}/user/${id}`, data);
  }
updateUser(id: number, data: { email: string; password: string; role: string }): Observable<Utilisateur> {
  return this.http.put<Utilisateur>(`${this.baseUrl}/user/${id}`, data);
}

  // 🔹 Supprimer un utilisateur
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/user/${id}`);
  }

  // 🔹 Inscription d’un utilisateur
  registerUser(data: { email: string; password: string; role: string }): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.baseUrl}/user/save`, data);
  }
}

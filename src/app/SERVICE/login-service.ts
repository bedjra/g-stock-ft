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

export interface Organisation {
   id?: number;
  nom?: string;
  logo?: any; // byte[] venant du backend
  logoUrl?: string; // champ calculé pour Angular
  adresse?: string;
  tel1?: string;
  tel2?: string;
}


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.baseUrl}/user/login`, credentials);
  }

  getAllUsers(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.baseUrl}/user`);
  }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/user/roles`);
  }

  getRoleByEmail(email: string): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/user/role/${email}`);
  }

  getCurrentUser(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.baseUrl}/user/info`);
  }

  updateUser(id: number, data: { email: string; password: string; role: string }): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.baseUrl}/user/${id}`, data);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/user/${id}`);
  }

  registerUser(data: { email: string; password: string; role: string }): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.baseUrl}/user/save`, data);
  }


  getOrganisation(): Observable<Organisation> {
    return this.http.get<Organisation>(this.baseUrl);
  }


}

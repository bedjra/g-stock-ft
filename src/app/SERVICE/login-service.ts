import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, delay } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Produit } from './stock';
import { MOCK_USERS } from './mock-users';

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

  // 🔹 Active/désactive le mode mock. Passe à false quand l'API est prête.
  private useMockFallback = environment.useMock;

  // 🔹 Copie locale mutable des mocks (pour simuler add/update/delete)
  private mockUsersDb: Utilisateur[] = MOCK_USERS.map(u => ({ ...u }));

  private currentUserRoleSubject = new BehaviorSubject<string | null>(null);
  currentUserRole$ = this.currentUserRoleSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<Utilisateur | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.baseUrl}/user/login`, credentials).pipe(
      map(user => {
        if (user.role) {
          this.currentUserRoleSubject.next(user.role);
          localStorage.setItem("userRole", user.role);
        }
        this.currentUserSubject.next(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        return user;
      }),
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, bascule en mode MOCK (login)');

        const found = this.mockUsersDb.find(
          u => u.email === credentials.email && u.password === credentials.password
        );

        if (!found) {
          throw { status: 401, message: 'Identifiants incorrects (mode mock)' };
        }

        const mockUser: Utilisateur = { id: found.id, email: found.email, password: found.password, role: found.role };
        this.currentUserRoleSubject.next(found.role ?? 'USER');
        this.currentUserSubject.next(mockUser);
        localStorage.setItem("currentUser", JSON.stringify(mockUser));
        localStorage.setItem("userRole", found.role ?? 'USER');

        return of(mockUser).pipe(delay(300));
      })
    );
  }

  getCurrenttUser(): Utilisateur | null {
    return this.currentUserSubject.value || JSON.parse(localStorage.getItem("currentUser") || 'null');
  }

  getCurrentRole(): string | null {
    return this.currentUserRoleSubject.value || localStorage.getItem("userRole");
  }

  logout() {
    this.currentUserSubject.next(null);
    this.currentUserRoleSubject.next(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole");
  }

  getAllUsers(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.baseUrl}/user`).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, bascule en mode MOCK (getAllUsers)');
        return of([...this.mockUsersDb]).pipe(delay(300));
      })
    );
  }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/user/roles`).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        return of(['ADMIN', 'MANAGER', 'USER']).pipe(delay(200));
      })
    );
  }

  getRoleByEmail(email: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/user/role/${email}`, { responseType: 'text' }).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        const found = this.mockUsersDb.find(u => u.email === email);
        return of(found?.role ?? 'USER').pipe(delay(200));
      })
    );
  }

  getCurrentUser(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.baseUrl}/user/info`).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        const current = this.getCurrenttUser();
        if (!current) throw { status: 401, message: 'Non authentifié (mode mock)' };
        return of(current).pipe(delay(200));
      })
    );
  }

  updateUser(id: number, data: { email: string; password: string; role: string }): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.baseUrl}/user/${id}`, data).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, bascule en mode MOCK (updateUser)');
        const idx = this.mockUsersDb.findIndex(u => u.id === id);
        if (idx === -1) throw { status: 404, message: 'Utilisateur introuvable (mode mock)' };
        this.mockUsersDb[idx] = { ...this.mockUsersDb[idx], ...data };
        return of(this.mockUsersDb[idx]).pipe(delay(300));
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/user/${id}`).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, bascule en mode MOCK (deleteUser)');
        this.mockUsersDb = this.mockUsersDb.filter(u => u.id !== id);
        return of(undefined).pipe(delay(300));
      })
    );
  }

  registerUser(data: { email: string; password: string; role: string }): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.baseUrl}/user/save`, data).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, bascule en mode MOCK (registerUser)');
        const newUser: Utilisateur = {
          id: Math.max(0, ...this.mockUsersDb.map(u => u.id ?? 0)) + 1,
          ...data
        };
        this.mockUsersDb.push(newUser);
        return of(newUser).pipe(delay(300));
      })
    );
  }

  importExcel(file: File): Observable<Produit[]> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Produit[]>(`${this.baseUrl}/stock/import`, formData).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, import Excel ignoré (mode mock)');
        return of([]).pipe(delay(300));
      })
    );
  }
}
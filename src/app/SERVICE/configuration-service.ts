import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface Configuration {
  id?: number;
  nom: string;
  logo?: Uint8Array | null;
  logoBase64?: string;
  logoUrl?: string;
  adresse: string;
  tel1: string;
  tel2: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private apiUrl = environment.apiUrl;
  private useMockFallback = environment.useMock;

  private mockConfig: Configuration = {
    id: 1,
    nom: 'G-STOCK Sarl',
    adresse: 'Cocody, Angré 8ème Tranche, Abidjan',
    tel1: '+225 07 00 00 00 00',
    tel2: '+225 01 00 00 00 00',
    logoUrl: '',
  };

  constructor(private http: HttpClient) {}

  getConfiguration(): Observable<Configuration[]> {
    return this.http.get<Configuration[]>(`${this.apiUrl}/config`).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback || err.status !== 0) throw err;
        console.warn('⚠️ Backend injoignable, mode MOCK (getConfiguration)');
        return of([{ ...this.mockConfig }]).pipe(delay(250));
      })
    );
  }

  getImage(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/config/image`, { responseType: 'blob' }).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback || err.status !== 0) throw err;
        console.warn('⚠️ Backend injoignable, mode MOCK (getImage)');
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
          <rect width="100%" height="100%" fill="#1c2333"/>
          <text x="50%" y="50%" fill="#e8a33d" font-size="16" text-anchor="middle" dy=".3em">G-STOCK</text>
        </svg>`;
        return of(new Blob([svg], { type: 'image/svg+xml' })).pipe(delay(250));
      })
    );
  }

  updateConfiguration(config: Configuration): Observable<Configuration> {
    return this.http.put<Configuration>(`${this.apiUrl}/config`, config).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback || err.status !== 0) throw err;
        console.warn('⚠️ Backend injoignable, mode MOCK (updateConfiguration)');
        this.mockConfig = { ...this.mockConfig, ...config };
        return of({ ...this.mockConfig }).pipe(delay(300));
      })
    );
  }

  private arrayBufferToBase64(buffer: any): string {
    if (typeof buffer === 'string') return buffer;
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  genererPDF(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf`, { responseType: 'blob' }).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback || err.status !== 0) throw err;
        console.warn('⚠️ Backend injoignable, mode MOCK (genererPDF)');
        const fakePdf = new Blob(
          [`DOCUMENT GÉNÉRÉ (mode mock)\n\nOrganisation: ${this.mockConfig.nom}\nAdresse: ${this.mockConfig.adresse}`],
          { type: 'application/pdf' }
        );
        return of(fakePdf).pipe(delay(300));
      })
    );
  }
}
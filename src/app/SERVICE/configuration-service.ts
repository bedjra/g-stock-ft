import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  constructor(private http: HttpClient) {}

  /**
   * Récupère la configuration de l'organisation
   */


getConfiguration(): Observable<Configuration[]> {
  return this.http.get<Configuration[]>(`${this.apiUrl}/config`);
}



  /**
   * Récupère directement l'image du backend
   */
  getImage(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/config/image`, { responseType: 'blob' });
  }

  /**
   * Met à jour la configuration
   */
  updateConfiguration(config: Configuration): Observable<Configuration> {
    return this.http.put<Configuration>(`${this.apiUrl}/config`, config);
  }

  /**
   * Convertit un ArrayBuffer en string base64
   */
  private arrayBufferToBase64(buffer: any): string {
    if (typeof buffer === 'string') {
      return buffer;
    }
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  /**
   * Générer un PDF depuis le backend
   */
  genererPDF(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf`, { responseType: 'blob' });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface Configuration {
  id?: number;
  nom: string;
  logo?: Uint8Array | null;
  logoBase64?: string; // Nouveau champ
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
getConfiguration(): Observable<Configuration> {
  return this.http.get<Configuration>(`${this.apiUrl/config}`).pipe(
    map(config => {
      if (config.logoBase64) {
        config.logoUrl = `data:image/png;base64,${config.logoBase64}`;
      }
      return config;
    })
  );
}

et image
    @GetMapping("/config/image")
    public ResponseEntity<byte[]> getImage() {
        byte[] image = stockService.getImage();

        if (image == null) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "image/png"); // Modifier selon le format réel de l'image (ex: image/jpeg)

        return new ResponseEntity<>(image, headers, HttpStatus.OK);
    }
  /**
   * Met à jour la configuration
   */
  updateConfiguration(config: Configuration): Observable<Configuration> {
    return this.http.put<Configuration>(`${this.apiUrl}`, config);
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


   genererPDF(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf`, { responseType: 'blob' });
  }

  
}
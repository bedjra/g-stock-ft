import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { environment } from '../environments/environment';

// ✅ Interface Produit (doit correspondre au modèle backend)
export interface Produit {
  id?: number;
  nom: string;
  ref: string;
  qte: number;
  prix: number;
}

export interface Vente {
  id?: number;
  produitId?: number;
  nom?: string;
  qte?: number;
  montant?: number;
  date?: string;
}

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = 'http://localhost:8060/api'; // 🔗 Ne pas changer
  private baseUrl = 'http://localhost:8060/api/vente';

  // 🔹 Bascule le service en mode "sans API". Passe à false quand le backend est prêt.
  private useMockFallback = environment.useMock;

  // 🔹 Données mockées en mémoire (mutables pour simuler add/update/delete)
  private mockProduits: Produit[] = [
    { id: 1, nom: 'Riz Basmati 5kg', ref: 'REF-001', qte: 42, prix: 8500 },
    { id: 2, nom: 'Huile Végétale 1L', ref: 'REF-002', qte: 15, prix: 2200 },
    { id: 3, nom: 'Savon Marseille', ref: 'REF-003', qte: 120, prix: 500 },
    { id: 4, nom: 'Farine de blé 1kg', ref: 'REF-004', qte: 3, prix: 900 },
    { id: 5, nom: 'Sucre en poudre 1kg', ref: 'REF-005', qte: 60, prix: 750 },
  ];

  private mockVentes: Vente[] = [
    { id: 1, produitId: 1, nom: 'Riz Basmati 5kg', qte: 2, montant: 17000, date: new Date().toISOString() },
    { id: 2, produitId: 3, nom: 'Savon Marseille', qte: 5, montant: 2500, date: new Date().toISOString() },
  ];

  constructor(private http: HttpClient) { }

  // ---------------------------------------------------------------
  // VENTES
  // ---------------------------------------------------------------

  getVentesAujourdhui(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, mode MOCK (getVentesAujourdhui)');
        return of(this.mockVentes.length).pipe(delay(200));
      })
    );
  }

  getMontantTotalVentesAujourdhui(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/montant`).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, mode MOCK (getMontantTotalVentesAujourdhui)');
        const total = this.mockVentes.reduce((sum, v) => sum + (v.montant ?? 0), 0);
        return of(total).pipe(delay(200));
      })
    );
  }

  getVentesRecentes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/recentes`).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, mode MOCK (getVentesRecentes)');
        return of([...this.mockVentes]).pipe(delay(300));
      })
    );
  }

//   enregistrerVente(payload: any): Observable<Blob> {
//   return this.http.post(this.baseUrl, payload, {   // ✅ this.baseUrl = .../api/vente, pas this.apiUrl
//     responseType: 'blob'
//   }).pipe(
//     catchError((err: any) => {
//       const isNetworkError = err.status === 0;
//       if (!this.useMockFallback || !isNetworkError) {
//         console.error('❌ Erreur réelle enregistrerVente:', err);
//         throw err;
//       }
//       console.warn('⚠️ Backend injoignable, mode MOCK (enregistrerVente)');
//       const fakePdf = new Blob(
//         [`REÇU DE VENTE (mode mock)\n\n${JSON.stringify(payload, null, 2)}`],
//         { type: 'application/pdf' }
//       );
//       return of(fakePdf).pipe(delay(300));
//     })
//   );
// }
 

enregistrerVente(payload: any): Observable<Blob> {
  return this.http.post(this.baseUrl, payload, {
    responseType: 'blob'
  }).pipe(
    catchError((err: any) => {
      const isNetworkError = err.status === 0;
      if (!this.useMockFallback || !isNetworkError) {
        // 🔍 Le corps d'erreur est un Blob JSON, on le lit pour voir le vrai message
        if (err.error instanceof Blob) {
          err.error.text().then((text: string) => {
            console.error('❌ Détail erreur backend (500):', text);
          });
        } else {
          console.error('❌ Erreur réelle enregistrerVente:', err);
        }
        throw err;
      }
      console.warn('⚠️ Backend injoignable, mode MOCK (enregistrerVente)');
      const fakePdf = new Blob(
        [`REÇU DE VENTE (mode mock)\n\n${JSON.stringify(payload, null, 2)}`],
        { type: 'application/pdf' }
      );
      return of(fakePdf).pipe(delay(300));
    })
  );
}
  // ---------------------------------------------------------------
  // PRODUITS / STOCK
  // ---------------------------------------------------------------

  // ➕ Ajouter un produit
  ajouterProduit(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(`${this.apiUrl}/stock`, produit).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, mode MOCK (ajouterProduit)');
        const newProduit: Produit = {
          id: Math.max(0, ...this.mockProduits.map(p => p.id ?? 0)) + 1,
          ...produit,
        };
        this.mockProduits.push(newProduit);
        return of(newProduit).pipe(delay(300));
      })
    );
  }

  // 📜 Récupérer tous les produits
  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/stock`).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, mode MOCK (getProduits)');
        return of([...this.mockProduits]).pipe(delay(300));
      })
    );
  }

  // 🔍 Récupérer par ID
  getProduitById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/stock/${id}`).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, mode MOCK (getProduitById)');
        const found = this.mockProduits.find(p => p.id === id);
        if (!found) return throwError(() => ({ status: 404, message: 'Produit introuvable (mode mock)' }));
        return of(found).pipe(delay(200));
      })
    );
  }

  // Récupérer un produit par nom
  getProduitByNom(nom: string): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/stock/nom/${nom}`).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, mode MOCK (getProduitByNom)');
        const found = this.mockProduits.find(p => p.nom.toLowerCase() === nom.toLowerCase());
        if (!found) return throwError(() => ({ status: 404, message: 'Produit introuvable (mode mock)' }));
        return of(found).pipe(delay(200));
      })
    );
  }

  // ✏️ Modifier produit
  updateProduit(id: number, produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/stock/${id}`, produit).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, mode MOCK (updateProduit)');
        const idx = this.mockProduits.findIndex(p => p.id === id);
        if (idx === -1) return throwError(() => ({ status: 404, message: 'Produit introuvable (mode mock)' }));
        this.mockProduits[idx] = { ...this.mockProduits[idx], ...produit, id };
        return of(this.mockProduits[idx]).pipe(delay(300));
      })
    );
  }

  // 🗑 Supprimer produit
  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/stock/${id}`).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, mode MOCK (deleteProduit)');
        this.mockProduits = this.mockProduits.filter(p => p.id !== id);
        return of(undefined).pipe(delay(300));
      })
    );
  }

  // 🔎 Rechercher par nom ou référence
  searchProduit(term: string): Observable<Produit[]> {
    const url = `${this.apiUrl}/stock/search?nom=${term}&ref=${term}`;
    return this.http.get<Produit[]>(url).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, mode MOCK (searchProduit)');
        const t = term.toLowerCase();
        const results = this.mockProduits.filter(
          p => p.nom.toLowerCase().includes(t) || p.ref.toLowerCase().includes(t)
        );
        return of(results).pipe(delay(250));
      })
    );
  }

  getTotalProduits(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stock/total`).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, mode MOCK (getTotalProduits)');
        return of(this.mockProduits.length).pipe(delay(200));
      })
    );
  }

  getValeurStock(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stock/valeur`).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, mode MOCK (getValeurStock)');
        const valeur = this.mockProduits.reduce((sum, p) => sum + p.qte * p.prix, 0);
        return of(valeur).pipe(delay(200));
      })
    );
  }

  // Enregistrer l'arrivage
  saveReappro(payload: any): Observable<any> {
    return this.http.post(this.apiUrl + '/reappro', payload, { responseType: 'text' }).pipe(
      catchError((err: any) => {
        if (!this.useMockFallback) throw err;
        console.warn('⚠️ API indisponible, mode MOCK (saveReappro)');

        // Met à jour la quantité du produit concerné si un id/qte est fourni
        if (payload?.produitId != null && payload?.qte != null) {
          const idx = this.mockProduits.findIndex(p => p.id === payload.produitId);
          if (idx !== -1) {
            this.mockProduits[idx].qte += Number(payload.qte);
          }
        }

        return of('Réapprovisionnement enregistré (mode mock)').pipe(delay(300));
      })
    );
  }
}
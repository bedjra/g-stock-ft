import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ Interface Produit (doit correspondre au modèle backend)
export interface Produit {
  id?: number;
  nom: string;
  ref: string;
  qte: number;
  prix: number;
}
@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = 'http://localhost:8060/api'; // 🔗 Ne pas changer

  constructor(private http: HttpClient) { }

  // ➕ Ajouter un produit
  ajouterProduit(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(`${this.apiUrl}/stock`, produit);
  }

  // 📜 Récupérer tous les produits
  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/stock`);
  }

  // 🔍 Récupérer par ID
  getProduitById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/stock/${id}`);
  }

  // ✏️ Modifier produit
  updateProduit(id: number, produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/stock/${id}`, produit);
  }

  // 🗑 Supprimer produit
  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/stock/${id}`);
  }

  // 🔎 Rechercher par nom ou référence
  searchProduit(term: string): Observable<Produit[]> {
    const url = `${this.apiUrl}/stock/search?nom=${term}&ref=${term}`;
    return this.http.get<Produit[]>(url);
  }

  // Enregistrer l'arrivage

saveReappro(payload: any): Observable<any> {
  return this.http.post(this.apiUrl + '/reappro', payload, { responseType: 'text' });
}



}

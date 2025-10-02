import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StockService } from '../../SERVICE/stock';

@Component({
  selector: 'app-reappro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reappro.html',
  styleUrls: ['./reappro.css']
})
export class Reappro implements OnInit {
  today = new Date().toLocaleDateString('fr-FR');

  // Liste produits depuis API
  produits: any[] = [];
  isLoading = true;

  // Champs du formulaire
  produitId: string = '';
  quantite: number = 1;

  // Liste brouillon
  brouillonProduits: { id: number, produit: any, quantite: number }[] = [];
  nextId = 1;

  constructor(private stockService: StockService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        this.loadProduits();
      }, 200);
    }
  }

  private loadProduits(): void {
    this.stockService.getProduits().subscribe({
      next: (data) => {
        console.log('✅ Produits reçus du serveur:', data);
        this.produits = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des produits :', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ajouterProduit() {
    const produitTrouve = this.produits.find(p => p.id == this.produitId);

    if (produitTrouve && this.quantite > 0) {
      this.brouillonProduits.push({
        id: this.nextId++,
        produit: produitTrouve,
        quantite: this.quantite,
      });

      this.produitId = '';
      this.quantite = 1;
    }
  }

  enregistrerArrivage() {
    if (this.brouillonProduits.length === 0) {
      alert("Aucun produit à enregistrer !");
      return;
    }

    console.log("📦 Arrivage envoyé :", this.brouillonProduits);
    alert("✅ Arrivage enregistré avec succès !");
    this.brouillonProduits = [];
    this.nextId = 1;
  }
}

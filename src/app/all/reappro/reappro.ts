import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StockService } from '../../SERVICE/stock';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reappro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reappro.html',
  styleUrls: ['./reappro.css']
})
export class Reappro implements OnInit {

  today = new Date().toLocaleDateString('fr-FR');

  produits: any[] = [];
  isLoading = true;

  produitId: string = '';
  quantite: number = 1;

  brouillonProduits: any[] = [];

  constructor(
    private stockService: StockService,
    private cdr: ChangeDetectorRef,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.loadProduits();
  }

  private loadProduits(): void {
    this.stockService.getProduits().subscribe({
      next: (data) => {
        this.produits = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement produits', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ajouterProduit(): void {
    const produit = this.produits.find(p => p.id == this.produitId);
    if (produit && this.quantite > 0) {
      // On ne stocke que ce qui est nécessaire pour le payload
      this.brouillonProduits.push({
        produit: { id: produit.id },
        nom: produit.nom,
        ref: produit.ref,
        qte: this.quantite
      });
      this.produitId = '';
      this.quantite = 1;
    }
  }

  enregistrerArrivage(): void {
    if (this.brouillonProduits.length === 0) {
      alert('Aucun produit à enregistrer !');
      return;
    }

    const dateArrivage = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const payload = {
      dateArrivage: dateArrivage,
      produits: this.brouillonProduits.map(p => ({
        produit: { id: p.produit.id },
        qte: p.qte
      }))
    };

    this.stockService.saveReappro(payload).subscribe({
      next: (res) => {
        alert('✅ Arrivage enregistré avec succès !');

        // Vider le formulaire
        this.brouillonProduits = [];
        this.produitId = '';
        this.quantite = 1;

        // Rediriger vers /produits
        this.router.navigate(['/produit']);
      },
      error: (err) => {
        console.error('Erreur enregistrement', err);
        alert('❌ Erreur lors de l’enregistrement');
      }
    });
  }

}

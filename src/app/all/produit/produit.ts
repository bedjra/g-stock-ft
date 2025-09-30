import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StockService, Produit as ProduitModel } from '../../SERVICE/stock'; // ✅ Renommer pour éviter conflit

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produit.html',
  styleUrls: ['./produit.css'] // ✅ c'était styleUrl → styleUrls
})
export class ProduitComponent implements OnInit {

  produits: ProduitModel[] = [];
  showModal = false;

  nouveauProduit: ProduitModel = {
    nom: '',
    ref: '',
    qte: 0,
    prix: 0
  };

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.getProduits();
  }

  // Charger la liste des produits
  getProduits(): void {
    this.stockService.getProduits().subscribe(data => {
      this.produits = data;
    });
  }

  // Ajouter un produit
  ajouterProduit(): void {
    this.stockService.ajouterProduit(this.nouveauProduit).subscribe(() => {
      this.getProduits(); // recharge la liste
      this.closeModal();
      this.nouveauProduit = { nom: '', ref: '', qte: 0, prix: 0 };
    });
  }

  searchTerm: string = '';

  rechercherProduit(): void {
    if (!this.searchTerm) {
      this.getProduits(); // recharge tous les produits si input vide
    } else {
      this.stockService.searchProduit(this.searchTerm).subscribe(
        data => this.produits = data,
        () => this.produits = [] 
      );
    }
  }


  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
}

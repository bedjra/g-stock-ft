import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StockService, Produit as ProduitModel } from '../../SERVICE/stock';

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produit.html',
  styleUrls: ['./produit.css']
})
export class ProduitComponent implements OnInit {

  produits: ProduitModel[] = [];
  showModal = false;

  // Pour différencier ajout / édition
  isEditing = false;
  selectedId: number | null = null;

  // Formulaire
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

  // ✅ Ouvrir modal pour ajout
  openModal(): void {
    this.showModal = true;
    this.isEditing = false;
    this.selectedId = null;
    this.nouveauProduit = { nom: '', ref: '', qte: 0, prix: 0 }; // reset form
  }

  // ✅ Ouvrir modal pour édition
  editProduit(produit: ProduitModel): void {
    this.showModal = true;
    this.isEditing = true;
    this.selectedId = produit.id ?? null; // si id existe
    this.nouveauProduit = { ...produit }; // clone l'objet
  }

  // ✅ Fermer modal
  closeModal(): void {
    this.showModal = false;
  }

  // ✅ Ajouter ou modifier un produit
  saveProduit(): void {
    if (this.isEditing && this.selectedId !== null) {
      // 🔄 Mise à jour
      this.stockService.updateProduit(this.selectedId, this.nouveauProduit).subscribe(() => {
        this.getProduits();
        alert('Produit modifié avec succès ✅');
        this.showModal = false;
      });
    } else {
      // ➕ Ajout
      this.stockService.ajouterProduit(this.nouveauProduit).subscribe(() => {
        this.getProduits();
        this.nouveauProduit = { nom: '', ref: '', qte: 0, prix: 0 };
        alert('Produit ajouté avec succès ✅');
        this.closeModal(); 
      });
    }
  }

  // ✅ Supprimer un produit
  deleteProduit(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.stockService.deleteProduit(id).subscribe(() => {
        this.getProduits();
        alert('Produit supprimé avec succès ❌');
        this.closeModal(); // ✅ Ajouté au cas où le modal serait ouvert
      });
    }
  }

  // ✅ Recherche
  searchTerm: string = '';
  rechercherProduit(): void {
    if (!this.searchTerm) {
      this.getProduits();
    } else {
      this.stockService.searchProduit(this.searchTerm).subscribe(
        data => this.produits = data,
        () => this.produits = []
      );
    }
  }
}
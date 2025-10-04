import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StockService, Produit as ProduitModel } from '../../SERVICE/stock';
import { LoginService } from '../../SERVICE/login-service';

@Component({
  selector: 'app-produit',
  imports: [CommonModule, FormsModule],
  templateUrl: './produit.html',
  styleUrls: ['./produit.css']
})
export class ProduitComponent implements OnInit {


  produits: ProduitModel[] = [];
  isLoading = true;
  role: string | null = null;

  showModal = false;
  isEditing = false;
  selectedId: number | null = null;

  nouveauProduit: ProduitModel = {
    nom: '',
    ref: '',
    qte: 0,
    prix: 0
  };

  constructor(
    private stockService: StockService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        this.loadProduits();
      }, 200);
    }
    this.role = this.loginService.getCurrentRole();

  }

  private loadProduits(): void {
    this.stockService.getProduits().subscribe({
      next: (data) => {
        this.produits = JSON.parse(JSON.stringify(data));
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
        this.loadProduits();
        alert('Produit modifié avec succès ✅');
        this.showModal = false;
      });
    } else {
      // ➕ Ajout
      this.stockService.ajouterProduit(this.nouveauProduit).subscribe(() => {
        this.loadProduits();
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
        this.loadProduits();
        alert('Produit supprimé avec succès ❌');
        this.closeModal(); // ✅ Ajouté au cas où le modal serait ouvert
      });
    }
  }

  // ✅ Recherche
  searchTerm: string = '';
  rechercherProduit(): void {
    if (!this.searchTerm) {
      this.loadProduits();
    } else {
      this.stockService.searchProduit(this.searchTerm).subscribe(
        data => this.produits = data,
        () => this.produits = []
      );
    }
  }
}
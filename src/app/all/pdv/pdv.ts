import { ChangeDetectorRef, Component } from '@angular/core';
import { StockService } from '../../SERVICE/stock';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../SERVICE/login-service';
import { Router } from '@angular/router';

interface Produit {
  id: number;
  nom: string;
  ref: string;
  qte: number;
  prix: number;
  categorie?: string;
}

interface CartItem extends Produit {
  quantity: number;
  remise?: number; 
}

@Component({
  selector: 'app-pdv',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pdv.html',
  styleUrls: ['./pdv.css']
})
export class Pdv {
  produits: Produit[] = [];
  filteredProduits: Produit[] = [];
  cart: { [key: number]: CartItem } = {};
  isLoading = true;

  // Filtres
  searchTerm = '';
  selectedCategory = '';
  categories: string[] = [];

  // ✅ Variables pour le popup de finalisation
  showCheckoutModal = false;
  montantPaye = 0;

  constructor(
    private stockService: StockService,
    private loginService: LoginService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      setTimeout(() => this.loadProduits(), 200);
    }
  }

  // 🛒 Liste des articles du panier
  get cartItems(): CartItem[] {
    return Object.values(this.cart);
  }

  // 💰 Sous-total avant remises
  get cartTotalAvantRemise(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.prix * item.quantity), 0);
  }

  // 🎁 Total des remises
  get montantRemise(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.remise || 0), 0);
  }

  // ✅ Total après remises
  get totalApresRemise(): number {
    return this.cartItems.reduce((sum, item) => sum + ((item.prix * item.quantity) - (item.remise || 0)), 0);
  }

  // 💵 Monnaie à rendre
  get monnaieRendue(): number {
    return Math.max(0, this.montantPaye - this.totalApresRemise);
  }

  // 🔢 Nombre total d’articles
  get totalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  get cartTotal(): number {
  return this.cartItems.reduce((sum, item) => sum + item.prix * item.quantity, 0);
}

  // 🔹 Chargement des produits
  private loadProduits(): void {
    this.stockService.getProduits().subscribe({
      next: (data) => {
        this.produits = JSON.parse(JSON.stringify(data));
        this.filteredProduits = [...this.produits];
        this.extractCategories();
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

  // 🔹 Extraire les catégories pour le filtrage
  private extractCategories(): void {
    const categorySet = new Set<string>();
    this.produits.forEach(p => {
      if (p.categorie) categorySet.add(p.categorie);
    });
    this.categories = Array.from(categorySet).sort();
  }

  // 🔔 Notifications console (peut être remplacé par un toast)
  private showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }

  // 🔎 Filtrer les produits
  filterProduits(): void {
    this.filteredProduits = this.produits.filter(produit => {
      const matchesSearch =
        produit.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        produit.ref.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory =
        !this.selectedCategory || produit.categorie === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  // 🛒 Ajouter un produit au panier
  addToCart(produit: Produit): void {
    if (produit.qte <= 0) {
      this.showNotification('❌ Produit hors stock', 'error');
      return;
    }

    if (this.cart[produit.id]) {
      if (this.cart[produit.id].quantity >= produit.qte) {
        this.showNotification('⚠️ Stock insuffisant', 'warning');
        return;
      }
      this.cart[produit.id].quantity++;
    } else {
      this.cart[produit.id] = { ...produit, quantity: 1, remise: 0 };
    }
  }

  // 🔄 Modifier la quantité d’un article
  updateQuantity(produitId: number, change: number): void {
    if (this.cart[produitId]) {
      const newQuantity = this.cart[produitId].quantity + change;
      const produit = this.produits.find(p => p.id === produitId);

      if (produit && newQuantity > produit.qte) {
        this.showNotification('⚠️ Stock insuffisant', 'warning');
        return;
      }

      if (newQuantity <= 0) {
        delete this.cart[produitId];
      } else {
        this.cart[produitId].quantity = newQuantity;
      }
    }
  }

  // ❌ Supprimer un article du panier
  removeFromCart(produitId: number): void {
    delete this.cart[produitId];
    this.showNotification('🗑️ Article retiré', 'info');
  }

  // 🧹 Vider le panier
  clearCart(): void {
    if (confirm('Voulez-vous vider le panier ?')) {
      this.cart = {};
      this.showNotification('🗑️ Panier vidé', 'info');
    }
  }

  // ✅ Ouvrir le popup de finalisation
  checkout(): void {
    if (this.cartItems.length === 0) {
      this.showNotification('❌ Le panier est vide', 'error');
      return;
    }

    this.montantPaye = this.totalApresRemise;
    this.showCheckoutModal = true;
  }

  // ❎ Fermer le popup
  closeCheckoutModal(): void {
    this.showCheckoutModal = false;
  }

  // ✅ Confirmer et enregistrer la vente
  confirmSale(): void {
    if (this.montantPaye < this.totalApresRemise) {
      this.showNotification('❌ Le montant payé est insuffisant', 'error');
      return;
    }

    const user = this.loginService.getCurrenttUser();

    if (!user || !user.email) {
      this.showNotification('❌ Vous devez être connecté', 'error');
      this.router.navigate(['/login']);
      return;
    }

    // ✅ Préparer les données à envoyer au backend
    const ventePayload = {
      emailVendeur: user.email,
      remise: this.montantRemise,
      montantTotal: this.totalApresRemise,
      montantPaye: this.montantPaye,
      monnaieRendue: this.monnaieRendue,
      lignes: this.cartItems.map(item => ({
        quantite: item.quantity,
        remise: item.remise || 0,
        produit: { id: item.id }
      }))
    };

    // ✅ Appel au service pour enregistrer la vente
    this.stockService.enregistrerVente(ventePayload).subscribe({
      next: (response: any) => {
        this.showNotification('✅ Vente finalisée avec succès !', 'success');

        // Téléchargement automatique du PDF (facture)
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `facture_${Date.now()}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);

        // Mise à jour des stocks
        this.cartItems.forEach(item => {
          const produit = this.produits.find(p => p.id === item.id);
          if (produit) produit.qte -= item.quantity;
        });

        // Nettoyage
        this.cart = {};
        this.showCheckoutModal = false;
        this.filterProduits();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur lors de la vente :', err);
        this.showNotification('❌ Erreur lors de la vente', 'error');
      }
    });
  }

  // ⚙️ Méthodes utilitaires
  getStockStatus(qte: number): 'out' | 'low' | 'ok' {
    if (qte <= 0) return 'out';
    if (qte <= 400) return 'low';
    return 'ok';
  }

  isOutOfStock(produit: Produit): boolean {
    return produit.qte <= 0;
  }

  getProductIcon(produit: Produit): string {
    if (!produit.categorie) return '📦';
    const categoryIcons: { [key: string]: string } = {
      'Accessoires': '📦',
      
    };
    return categoryIcons[produit.categorie] || '📦';
  }
}

import { ChangeDetectorRef, Component } from '@angular/core';
import { LoginService } from '../../SERVICE/login-service';
import { StockService } from '../../SERVICE/stock';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
}

@Component({
  selector: 'app-pdv',
  imports: [FormsModule, CommonModule],
  templateUrl: './pdv.html',
  styleUrl: './pdv.css'
})
export class Pdv {
  produits: Produit[] = [];
  filteredProduits: Produit[] = [];
  cart: { [key: number]: CartItem } = {};
  isLoading = true;
  role = '';
  
  // Filtres
  searchTerm = '';
  selectedCategory = '';
  categories: string[] = [];

  constructor(
    private stockService: StockService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      setTimeout(() => this.loadProduits(), 200);
    }
  }

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

  private extractCategories(): void {
    const categorySet = new Set<string>();
    this.produits.forEach(p => {
      if (p.categorie) categorySet.add(p.categorie);
    });
    this.categories = Array.from(categorySet).sort();
  }

  filterProduits(): void {
    this.filteredProduits = this.produits.filter(produit => {
      const matchesSearch = 
        produit.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        produit.ref.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = 
        !this.selectedCategory || 
        produit.categorie === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }

  addToCart(produit: Produit): void {
    if (produit.qte <= 0) {
      this.showNotification('❌ Produit hors stock', 'error');
      return;
    }

    if (this.cart[produit.id]) {
      // Vérifier si on ne dépasse pas le stock
      if (this.cart[produit.id].quantity >= produit.qte) {
        this.showNotification('⚠️ Stock insuffisant', 'warning');
        return;
      }
      this.cart[produit.id].quantity++;
    } else {
      this.cart[produit.id] = { ...produit, quantity: 1 };
    }
    
    this.showNotification('✅ Ajouté au panier', 'success');
  }

  updateQuantity(produitId: number, change: number): void {
    if (this.cart[produitId]) {
      const newQuantity = this.cart[produitId].quantity + change;
      
      // Vérifier le stock disponible
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

  removeFromCart(produitId: number): void {
    delete this.cart[produitId];
    this.showNotification('🗑️ Article retiré', 'info');
  }

  clearCart(): void {
    if (confirm('Voulez-vous vider le panier ?')) {
      this.cart = {};
      this.showNotification('🗑️ Panier vidé', 'info');
    }
  }

  get cartItems(): CartItem[] {
    return Object.values(this.cart);
  }

  get cartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.prix * item.quantity, 0);
  }

  get totalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      this.showNotification('❌ Le panier est vide', 'error');
      return;
    }

    const confirmation = confirm(
      `Confirmer la vente ?\n\n` +
      `Articles : ${this.totalItems}\n` +
      `Total : ${this.cartTotal.toLocaleString()} F CFA`
    );

    if (confirmation) {
      // Mettre à jour les stocks
      this.cartItems.forEach(item => {
        const produit = this.produits.find(p => p.id === item.id);
        if (produit) {
          produit.qte -= item.quantity;
        }
      });

      this.showNotification('✅ Vente finalisée avec succès!', 'success');
      this.cart = {};
      this.filterProduits(); // Rafraîchir l'affichage
      this.cdr.detectChanges();
    }
  }

  private showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    // Cette méthode peut être étendue pour utiliser un service de notification
    // Pour l'instant, on peut utiliser console ou un toast
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Si vous avez un service de notification, utilisez-le ici
    // Ex: this.notificationService.show(message, type);
  }

  getStockStatus(qte: number): 'out' | 'low' | 'ok' {
    if (qte <= 0) return 'out';
    if (qte <= 4) return 'low';
    return 'ok';
  }

  isOutOfStock(produit: Produit): boolean {
    return produit.qte <= 0;
  }

  getProductIcon(produit: Produit): string {
    // Retourner une icône basée sur la catégorie ou le nom
    if (!produit.categorie) return '📦';
    
    const categoryIcons: { [key: string]: string } = {
      'Électronique': '💻',
      'Alimentaire': '🍚',
      'Vêtements': '👕',
      'Accessoires': '🎒'
    };
    
    return categoryIcons[produit.categorie] || '📦';
  }
}
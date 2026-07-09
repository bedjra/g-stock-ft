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
}

@Component({
  selector: 'app-pdv',
  imports: [FormsModule, CommonModule],
  templateUrl: './pdv.html',
  styleUrls: ['./pdv.css']
})
export class Pdv {
  produits: Produit[] = [];
  filteredProduits: Produit[] = [];
  cart: { [key: number]: CartItem } = {};
  isLoading = true;

  searchTerm = '';
  selectedCategory = '';
  categories: string[] = [];

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

  get cartItems(): CartItem[] {
    return Object.values(this.cart);
  }

  get cartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.prix * item.quantity, 0);
  }

  get totalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
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
      error: (err: any) => {
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

  private showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }

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
      this.cart[produit.id] = { ...produit, quantity: 1 };
    }
  }

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

  // ✅ Checkout : envoie la vente au backend et télécharge le PDF
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

    if (!confirmation) return;

    const user = this.loginService.getCurrenttUser();

    if (!user || !user.email) {
      this.showNotification('❌ Vous devez être connecté', 'error');
      this.router.navigate(['/login']);
      return;
    }

    const ventePayload = {
      emailVendeur: user.email,
      lignes: this.cartItems.map(item => ({
        quantite: item.quantity,
        produit: { id: item.id }
      }))
    };

    this.stockService.enregistrerVente(ventePayload).subscribe({
      next: (blob: Blob) => {
        this.showNotification('✅ Vente finalisée avec succès !', 'success');

        // blob est déjà un Blob PDF (responseType: 'blob' côté service) — pas besoin de le réenvelopper
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `facture_${Date.now()}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);

        this.cartItems.forEach(item => {
          const produit = this.produits.find(p => p.id === item.id);
          if (produit) produit.qte -= item.quantity;
        });

        this.cart = {};
        this.filterProduits();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur lors de la vente :', err);
        this.showNotification('❌ Erreur lors de la vente', 'error');
      }
    });
  }

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
    const categoryIcons: { [key: string]: string } = { 'Accessoires': '📦' };
    return categoryIcons[produit.categorie] || '📦';
  }

  
}
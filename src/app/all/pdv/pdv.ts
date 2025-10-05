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
}

interface CartItem extends Produit {
  quantity: number;
}

@Component({
  selector: 'app-pdv',
  imports: [FormsModule,CommonModule],
  templateUrl: './pdv.html',
  styleUrl: './pdv.css'
})
export class Pdv {
  produits: Produit[] = [];
  cart: { [key: number]: CartItem } = {};
  isLoading = true;
  role = '';

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

  addToCart(produit: Produit): void {
    if (produit.qte <= 0) return;

    if (this.cart[produit.id]) {
      this.cart[produit.id].quantity++;
    } else {
      this.cart[produit.id] = { ...produit, quantity: 1 };
    }
  }

  updateQuantity(produitId: number, change: number): void {
    if (this.cart[produitId]) {
      this.cart[produitId].quantity += change;
      if (this.cart[produitId].quantity <= 0) {
        delete this.cart[produitId];
      }
    }
  }

  get cartItems(): CartItem[] {
    return Object.values(this.cart);
  }

  get cartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.prix * item.quantity, 0);
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      alert('Le panier est vide');
      return;
    }
    alert(`Vente finalisée !\nTotal : ${this.cartTotal.toLocaleString()} F CFA`);
    this.cart = {};
  }
}

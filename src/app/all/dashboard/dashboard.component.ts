import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StockService } from '../../SERVICE/stock';
import { LoginService } from '../../SERVICE/login-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalProduits: number = 0;
  valeurStock: number = 0;
  ventesAujourdhui: number = 0;
  userRole: string | null = null; 
  ventesRecentes: any[] = [];


  constructor(
    private stockService: StockService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        this.userRole = this.loginService.getCurrentRole(); // 👈 récupère depuis localStorage/LoginService
        this.chargerStatistiques();
        this.cdr.detectChanges(); // forcer Angular à détecter les changements
      }, 200);
    }
  }

  chargerStatistiques(): void {
    this.stockService.getTotalProduits().subscribe({
      next: (data) => {
        this.totalProduits = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur total produits:', err),
    });

    this.stockService.getValeurStock().subscribe({
      next: (data) => {
        this.valeurStock = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur valeur stock:', err),
    });

    this.stockService.getVentesAujourdhui().subscribe({
      next: (data) => {
        this.ventesAujourdhui = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur ventes aujourd’hui:', err),
    });

    // 🔹 Appel des 3 dernières ventes
  this.stockService.getVentesRecentes().subscribe({
    next: (data) => {
      this.ventesRecentes = data;
      this.cdr.detectChanges();
    },
    error: (err) => console.error('Erreur récupération dernières ventes:', err),
  });

  


  }
}

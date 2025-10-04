import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Produit, StockService } from '../../SERVICE/stock';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail.html',
  styleUrls: ['./detail.css']   

})
export class Detail implements OnInit {
  produit: Produit | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stockService: StockService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const nom = this.route.snapshot.queryParamMap.get('nom');
    console.log("🔍 Recherche produit avec nom:", nom);

    if (nom) {
      this.stockService.getProduitByNom(nom).subscribe({
        next: (produit) => {
          this.produit = produit;
          console.log("✅ Produit trouvé:", produit);
          this.cdr.detectChanges(); // 👈 force Angular à rafraîchir
        },
        error: () => {
          this.router.navigate(['/produit']);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/produit']);
  }
}

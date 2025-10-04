import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Produit, StockService } from '../../SERVICE/stock';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() currentPage = 'Tableau de bord';

  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() searchQuery = new EventEmitter<string>();

  collapsed = false;

  userMenuOpen = false;
  notificationCount = 3;

  userName: string = 'Utilisateur';
  userInitials: string = '?';

  searchId: string = '';
  produitTrouve: Produit | null = null;
  errorMessage: string = '';

  constructor(private router: Router,
    private stockService: StockService
  ) {
    // Écouter les changements de route pour mettre à jour le breadcrumb
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;
        switch (url) {
          case '/dashboard':
            this.currentPage = 'Tableau de bord';
            break;
          case '/produit':
            this.currentPage = 'Produits';
            break;
          case '/pdv':
            this.currentPage = 'Point de Vente';
            break;
          case '/inventaire':
            this.currentPage = 'Inventaires';
            break;
          case '/reappro':
            this.currentPage = 'Réapprovisionnement';
            break;
          case '/parametre':
            this.currentPage = 'Paramètres';
            break;
          case url.startsWith('/detail') ? url : '':
            this.currentPage = 'Détail';
            break;
          default:
            this.currentPage = '';

        }
      });
  }

  ngOnInit(): void {
    // Récupérer l'utilisateur depuis localStorage
    const userString = localStorage.getItem('currentUser'); // ✅ même clé que dans le login
    if (userString) {
      const user = JSON.parse(userString);

      // ⚡ Utilise son email ou un autre champ comme nom
      this.userName = user.email ?? 'Utilisateur';

      // ⚡ Initiales à partir de l’email ou nom
      this.userInitials = user.email
        ? user.email.charAt(0).toUpperCase()
        : '?';
    }
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  toggleNotifications(): void {
    console.log('Notifications clicked');
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.userMenuOpen = false;
    this.router.navigate(['/login']);
  }
  goToProfil(): void {
    this.userMenuOpen = false; // ferme le menu
    this.router.navigate(['/profil']); // redirection vers la route profil
  }


  rechercherProduit() {
    const nom = this.searchId.trim();
    if (!nom) {
      this.errorMessage = 'Veuillez entrer un nom';
      return;
    }

    // ✅ Naviguer avec le nom en paramètre d’URL
    this.router.navigate(['/detail'], { queryParams: { nom } });
  }



}

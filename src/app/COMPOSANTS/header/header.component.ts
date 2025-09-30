import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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

  constructor(private router: Router) {
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

}

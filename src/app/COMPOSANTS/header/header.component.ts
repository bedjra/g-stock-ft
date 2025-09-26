import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() currentPage = 'Tableau de bord';
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() searchQuery = new EventEmitter<string>();

/*  searchQuery_internal = '';*/
  userMenuOpen = false;
  notificationCount = 3;

  // 🔧 Ces deux lignes manquaient !
  userName: string = 'Utilisateur';
  userInitials: string = '?';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.userName = user.role ?? 'Utilisateur';
      this.userInitials = user.role?.charAt(0).toUpperCase() ?? '?';
    } else {
      this.userName = 'Utilisateur';
      this.userInitials = '?';
    }
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

/*  onSearch(): void {
    if (this.searchQuery_internal.trim()) {
      this.searchQuery.emit(this.searchQuery_internal);
    }
  }
*/
  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  toggleNotifications(): void {
    console.log('Notifications clicked');
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userMenuOpen = false;
    this.router.navigate(['/login']);
  }
}

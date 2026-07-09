import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  imports: [RouterModule], // ✅ Ajoute ce module ici
})
export class MenuComponent {
  @Input() collapsed = false;
  @Output() menuItemClick = new EventEmitter<string>();

  activeMenuItem = 'dashboard';
  openSubmenus: string[] = [];

  toggleSubmenu(submenuKey: string): void {
    if (this.collapsed) return;

    const isOpen = this.openSubmenus.includes(submenuKey);

    if (isOpen) {
      this.openSubmenus = this.openSubmenus.filter((key) => key !== submenuKey);
    } else {
      this.openSubmenus.push(submenuKey);
    }
  }

  selectMenuItem(menuItem: string): void {
    this.activeMenuItem = menuItem;
    this.menuItemClick.emit(menuItem);
  }


  
}

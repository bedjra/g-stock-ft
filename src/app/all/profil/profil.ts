import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface User {
  id?: number;
  email: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-profil',
  standalone: true,   // ✅ composant autonome
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.html',
  styleUrls: ['./profil.css']
})
export class Profil {
  user: User = {
    email: 'test@example.com',
    password: '******',
    role: 'ADMIN'
  };

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']); // ex: retour vers dashboard
  }
}

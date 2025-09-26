import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './log.html',
  styleUrls: ['./log.css'],
})
export class Log {
  // Préremplissage
  credentials = {
    username: 'user',
    password: '12',
  };

  constructor(private router: Router) {}

  onLogin(): void {
    // Vérification côté frontend
    if (!this.credentials.username || !this.credentials.password) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    // Login "mock"
    if (this.credentials.username === 'user' && this.credentials.password === '12') {
      alert('Connexion réussie ! Bienvenue ' + this.credentials.username);
      // Ici tu peux rediriger vers un "dashboard" fictif
       this.router.navigate(['/dashboard']);
    } else {
      alert('Nom ou mot de passe incorrect.');
    }
  }
}

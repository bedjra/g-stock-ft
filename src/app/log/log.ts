import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService, Utilisateur } from '../SERVICE/login-service';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './log.html',
  styleUrls: ['./log.css'],
})
export class Log {
  credentials = {
    email: '',  // ⚡ utilise email au lieu de username pour correspondre à ton backend
    password: '',
  };

  loading = false;
  errorMessage = '';

  constructor(private router: Router, private loginService: LoginService) {}

  onLogin(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.loginService.login(this.credentials).subscribe({
      next: (user: Utilisateur) => {
        this.loading = false;
        alert('Connexion réussie ! Bienvenue ' + user.email);

        // 🔹 Exemple : stocker l'utilisateur connecté dans localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Redirection après login
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur de connexion', err);
        this.errorMessage = 'Nom d’utilisateur ou mot de passe incorrect.';
      },
    });
  }
}

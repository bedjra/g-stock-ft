import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService, Utilisateur } from '../SERVICE/login-service';
import { StockService } from '../SERVICE/stock'; // Service pour récupérer le rôle

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './log.html',
  styleUrls: ['./log.css'],
})
export class Log {
  credentials = {
    email: '',
    password: '',
  };

  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private stockService: StockService // 🔹 injection du service
  ) { }

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

        // Stocker l'utilisateur dans localStorage
        localStorage.removeItem('roleConnecte');

        localStorage.setItem('currentUser', JSON.stringify(user));

        // 🔹 Récupérer le rôle depuis le backend
        this.loginService.getRoleByEmail(user.email).subscribe({
          next: (role: string) => {
            const roleNormalise = role.trim().toUpperCase();
            localStorage.setItem('roleConnecte', roleNormalise);
            console.log('Rôle connecté :', roleNormalise);
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('Impossible de récupérer le rôle', err);
            this.router.navigate(['/dashboard']);
          }
        });


      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur de connexion', err);
        alert('Nom d’utilisateur ou mot de passe incorrect.');
      },
    });
  }

}

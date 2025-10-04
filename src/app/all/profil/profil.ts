import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService, Utilisateur } from '../../SERVICE/login-service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.html',
  styleUrls: ['./profil.css']
})
export class Profil implements OnInit {
  user: Utilisateur | null = null;
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit() {
    this.user = this.loginService.getCurrenttUser(); // récupère l'utilisateur déjà stocké
    if (!this.user) {
      this.router.navigate(['/login']); // redirige si pas connecté
    }
  }



  goBack() {
    this.router.navigate(['/dashboard']); // retour vers dashboard
  }

  logout() {
    this.loginService.logout(); // supprime toutes les infos (role + user)
    this.user = null;
    this.router.navigate(['/login']); // redirection vers login
  }

  editProfile() {
    // redirection vers page édition ou modal
    console.log('Modifier profil', this.user);
  }
}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgModel } from '@angular/forms';
import { LoginService } from '../../SERVICE/login-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './parametres.html',
  styleUrls: ['./parametres.css'],
})
export class Parametres {
  ongletActif: string = 'config';
  isLoading = true;
  /*
    // Formulaire
    credentials = {
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    };
  
    roles: string[] = ['admin', 'secretaire'];
    passwordVisible: boolean = false;
    utilisateurs: any[] = [];
    roleConnecte: string | null = null;
  
    // Edition
    isEditMode: boolean = false;
    editIndex: number = -1;
  
    // Chargement
    loading: boolean = false;
  
    constructor(
      private loginService: LoginService,
      private primaireService: Primaire,
      private cdr: ChangeDetectorRef,
      private router: Router
    ) {}
  
    ngOnInit(): void {
      this.roleConnecte = this.loginService.getUserRole();
      this.chargerUtilisateurs();
  
      this.chargerScolarites();
  
      this.chargerProfesseurs();
  
      this.chargerMatieres();
  
       if (typeof window !== 'undefined') {
        setTimeout(() => {
          this.chargerConfigurations();
        }, 200);
      }
    }
  
    // 🔄 Charger les utilisateurs
    chargerUtilisateurs(): void {
      this.loading = true;
  
      this.loginService.getAllUsers().subscribe({
        next: (data) => {
          this.utilisateurs = data;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        },
      });
  
      
    }
  
    // ➕ Ajouter un nouvel utilisateur
    ajouterUtilisateur(): void {
      const { email, password, confirmPassword, role } = this.credentials;
  
      if (
        !email.trim() ||
        !password.trim() ||
        !confirmPassword.trim() ||
        !role.trim()
      ) {
        alert('Tous les champs sont obligatoires.');
        return;
      }
  
      if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas.');
        return;
      }
  
      const data = {
        email: email.trim(),
        password: password.trim(),
        role: role.trim(),
      };
  
      this.loginService.registerUser(data).subscribe({
        next: () => {
          alert('Inscription réussie !');
          this.resetForm();
          this.chargerUtilisateurs();
        },
        error: (err) => {
          console.error(err);
          alert("Erreur lors de l'inscription.");
        },
      });
    }
  
    // ✏️ Préparer pour modification
    remplirFormulairePourModification(user: any, index: number): void {
      this.credentials = {
        email: user.email,
        password: user.password,
        confirmPassword: user.password,
        role: user.role,
      };
      this.isEditMode = true;
      this.editIndex = index;
    }
  
    // ✏️ Modifier l'utilisateur existant
    modifierUtilisateur(): void {
      if (this.editIndex === -1) return;
  
      const { email, password, confirmPassword, role } = this.credentials;
  
      if (
        !email.trim() ||
        !password.trim() ||
        !confirmPassword.trim() ||
        !role.trim()
      ) {
        alert('Tous les champs sont obligatoires.');
        return;
      }
  
      if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas.');
        return;
      }
  
      const updatedUser = {
        email: email.trim(),
        password: password.trim(),
        role: role.trim(),
      };
  
      const userId = this.utilisateurs[this.editIndex].id;
  
      this.loginService.updateUser(userId, updatedUser).subscribe({
        next: () => {
          alert('Utilisateur modifié avec succès !');
          this.resetForm();
          this.chargerUtilisateurs();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la modification.');
        },
      });
    }
  
    // 🗑️ Supprimer un utilisateur
    supprimerUtilisateur(index: number): void {
      const userId = this.utilisateurs[index].id;
  
      if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
        this.loginService.deleteUser(userId).subscribe({
          next: () => {
            alert('Utilisateur supprimé.');
            this.chargerUtilisateurs();
  
            if (this.editIndex === index) {
              this.resetForm();
            }
          },
          error: (err) => {
            console.error(err);
            alert('Erreur lors de la suppression.');
          },
        });
      }
    }
  
    // ♻️ Réinitialiser le formulaire
    resetForm(): void {
      this.credentials = {
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
      };
      this.isEditMode = false;
      this.editIndex = -1;
      this.passwordVisible = false;
    }
  */

  organisation: any = {
    nom: '',
    logoUrl: '',
    adresse: '',
    ville: '',
    telephone: '',
    email: ''
  };


  

  onSubmit() {
    
  }
}

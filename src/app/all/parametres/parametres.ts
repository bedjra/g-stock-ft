import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgModel } from '@angular/forms';
import { LoginService } from '../../SERVICE/login-service';
import { RouterModule } from '@angular/router';
import { Configuration, ConfigurationService } from '../../SERVICE/configuration-service';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './parametres.html',
  styleUrls: ['./parametres.css'],
})
export class Parametres {
  ongletActif: string = 'utilisateur';
  isLoading = true;

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
    private configService: ConfigurationService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.chargerUtilisateurs();
    this.loadConfiguration();


  }

  // 🔄 Charger les utilisateurs
  chargerUtilisateurs(): void {
    this.loading = true;

    this.loginService.getAllUsers().subscribe({
      next: (data) => {
        this.utilisateurs = data;
        this.loading = false;
        this.cdr.detectChanges(); // ✅ force Angular à mettre à jour l’affichage
      },
      error: (err) => {
        this.loading = false;
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




  // ➕ Ajouter un nouvel utilisateur
  ajouterUtilisateur(): void {
    const { email, password, confirmPassword, role } = this.credentials;

    if (!email.trim() || !password.trim() || !confirmPassword.trim() || !role.trim()) {
      alert('Tous les champs sont obligatoires.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    const data = { email: email.trim(), password: password.trim(), role: role.trim() };

    this.loginService.registerUser(data).subscribe({
      next: () => {
        alert('Inscription réussie !');
        this.resetForm();
        this.chargerUtilisateurs(); // 🔹 Actualisation automatique
      },
      error: (err) => {
        console.error(err);
        alert("Erreur lors de l'inscription.");
      },
    });
  }

  // ✏️ Modifier un utilisateur
  modifierUtilisateur(): void {
    if (this.editIndex === -1) return;

    const { email, password, confirmPassword, role } = this.credentials;

    if (!email.trim() || !password.trim() || !confirmPassword.trim() || !role.trim()) {
      alert('Tous les champs sont obligatoires.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    const updatedUser = { email: email.trim(), password: password.trim(), role: role.trim() };
    const userId = this.utilisateurs[this.editIndex].id;

    this.loginService.updateUser(userId, updatedUser).subscribe({
      next: () => {
        alert('Utilisateur modifié avec succès !');
        this.resetForm();
        this.chargerUtilisateurs(); // 🔹 Actualisation automatique
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
          this.chargerUtilisateurs(); // 🔹 Actualisation automatique après suppression
          if (this.editIndex === index) this.resetForm();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la suppression.');
        },
      });
    }
  }

  file!: File;
  fileName: string = '';
  message: string = '';



  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.file = selectedFile;
      this.fileName = selectedFile.name;
      this.message = '';
    }
  }

  uploadFile() {
    if (!this.file) {
      alert('Veuillez sélectionner un fichier.');
      return;
    }

    this.loginService.importExcel(this.file).subscribe({
      next: (res: any) => {
        alert(`Importation réussie ! ${res.length} produits ajoutés.`);
        this.fileName = '';
        this.message = '';
        this.router.navigate(['/produit']);

      },
      error: (err) => {
        alert('Erreur lors de l\'importation du fichier.');
        console.error(err);
      }
    });
  }

// Propriétés nécessaires pour le template
  organisation: Configuration = {
    nom: '',
    adresse: '',
    tel1: '',
    tel2: '',
    logoUrl: ''
  };
  
  errorMessage: string = '';




  /**
   * Charge la configuration depuis le backend
   */
  loadConfiguration(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.configService.getConfiguration().subscribe({
      next: (config: Configuration) => {
        this.organisation = config;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Impossible de charger la configuration';
        this.isLoading = false;
      }
    });
  }

  /**
   * Rafraîchit la configuration
   */
  refreshConfiguration(): void {
    this.loadConfiguration();
  }

genererPDF() {
  
}


}

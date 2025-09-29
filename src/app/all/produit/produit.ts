import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produit',
  imports: [CommonModule,FormsModule, ],
  templateUrl: './produit.html',
  styleUrl: './produit.css'
})
export class Produit {
showModal = false;

  nouveauProduit = {
    nom: '',
    reference: '',
    quantite: 0,
    prixUnitaire: 0,
    prixGros: 0
  };

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  ajouterProduit() {
    console.log('Produit ajouté :', this.nouveauProduit);
    this.closeModal();
  }

}

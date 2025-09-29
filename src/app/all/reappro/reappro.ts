import { Component } from '@angular/core';

@Component({
  selector: 'app-reappro',
  imports: [],
  templateUrl: './reappro.html',
  styleUrl: './reappro.css'
})
export class Reappro {
  today = new Date().toLocaleDateString('fr-FR'); // exemple : 28/09/2025

}

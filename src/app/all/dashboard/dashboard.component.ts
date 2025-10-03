import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Configuration } from '../../SERVICE/configuration-service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  totalStudents = 5000;
  totalBulletins = 573;
  totalPayments = 12234;
  totalRevenue = 15500000;
  totalEleves!: number;

  constructor() {}

  ngOnInit(): void {
    // Initialisation des données
  }
    organisation: Configuration = {
      nom: '',
      adresse: '',
      tel1: '',
      tel2: '',
      logoUrl: ''
    };
}

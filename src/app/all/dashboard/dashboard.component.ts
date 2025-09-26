import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
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
}

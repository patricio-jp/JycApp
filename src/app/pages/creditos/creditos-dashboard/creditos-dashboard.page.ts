import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-creditos-dashboard',
  templateUrl: './creditos-dashboard.page.html',
  styleUrls: ['./creditos-dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CreditosDashboardPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

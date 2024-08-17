import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-productos-dashboard',
  templateUrl: './productos-dashboard.page.html',
  styleUrls: ['./productos-dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ProductosDashboardPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

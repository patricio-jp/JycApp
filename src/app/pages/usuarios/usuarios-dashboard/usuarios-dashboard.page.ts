import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-usuarios-dashboard',
  templateUrl: './usuarios-dashboard.page.html',
  styleUrls: ['./usuarios-dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class UsuariosDashboardPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

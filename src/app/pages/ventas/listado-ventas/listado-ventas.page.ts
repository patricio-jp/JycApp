import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-listado-ventas',
  templateUrl: './listado-ventas.page.html',
  styleUrls: ['./listado-ventas.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ListadoVentasPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

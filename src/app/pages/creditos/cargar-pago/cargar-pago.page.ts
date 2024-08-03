import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-cargar-pago',
  templateUrl: './cargar-pago.page.html',
  styleUrls: ['./cargar-pago.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CargarPagoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

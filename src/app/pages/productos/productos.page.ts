import { Component } from '@angular/core';
import {
  IonTabs,
  IonIcon,
  IonTabButton,
  IonTabBar,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, barChartOutline, listOutline } from 'ionicons/icons';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [
    IonTitle,
    IonToolbar,
    IonHeader,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonTabs,
  ],
})
export class ProductosPage {
  constructor() {
    addIcons({ barChartOutline, addOutline, listOutline });
  }
}

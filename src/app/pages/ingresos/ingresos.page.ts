import { Component } from '@angular/core';
import {
  IonTabs,
  IonIcon,
  IonTabButton,
  IonTabBar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, barChartOutline, listOutline } from 'ionicons/icons';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.page.html',
  styleUrls: ['./ingresos.page.scss'],
  standalone: true,
  imports: [IonTabBar, IonTabButton, IonIcon, IonTabs],
})
export class IngresosPage {
  constructor() {
    addIcons({ barChartOutline, add, listOutline });
  }
}

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
import { barChartOutline, listOutline, personAddOutline } from 'ionicons/icons';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
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
export class UsuariosPage {
  constructor() {
    addIcons({ barChartOutline, personAddOutline, listOutline });
  }
}

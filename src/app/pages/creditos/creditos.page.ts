import { Component } from '@angular/core';
import {
  IonTabs,
  IonIcon,
  IonTabButton,
  IonTabBar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { barChartOutline, walletOutline, listOutline } from 'ionicons/icons';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.page.html',
  styleUrls: ['./creditos.page.scss'],
  standalone: true,
  imports: [IonTabBar, IonTabButton, IonIcon, IonTabs],
})
export class CreditosPage {
  constructor() {
    addIcons({ barChartOutline, walletOutline, listOutline });
  }
}

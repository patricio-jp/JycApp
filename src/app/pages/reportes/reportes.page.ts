import { Component } from '@angular/core';
import {
  IonTabs,
  IonIcon,
  IonTabButton,
  IonTabBar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { barChartOutline, listOutline } from 'ionicons/icons';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
  standalone: true,
  imports: [IonTabBar, IonTabButton, IonIcon, IonTabs],
})
export class ReportesPage {
  constructor() {
    addIcons({ barChartOutline, listOutline });
  }
}

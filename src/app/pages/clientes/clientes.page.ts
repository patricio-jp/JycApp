import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonTabs,
  IonIcon,
  IonTabButton,
  IonTabBar,
  IonSplitPane,
  IonList,
  IonItem,
  IonMenu,
  IonLabel,
  IonButtons,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { barChartOutline, personAddOutline, listOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonItem,
    IonList,
    IonSplitPane,
    IonList,
    IonLabel,
    IonMenu,
    IonTabBar,
    IonTabButton,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonTabs,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    RouterLink,
  ],
})
export class ClientesPage {
  constructor() {
    addIcons({ barChartOutline, personAddOutline, listOutline });
  }
}

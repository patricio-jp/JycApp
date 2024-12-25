import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSplitPane,
  IonMenu,
  IonButtons,
  IonMenuButton,
  IonList,
  IonItem,
  IonLabel,
  IonRouterOutlet,
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: 'layout.component.html',
  styleUrls: ['layout.component.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonItem,
    IonList,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSplitPane,
    IonMenu,
    IonButtons,
    IonMenuButton,
    RouterLink,
    IonRouterOutlet,
  ],
})
export class LayoutComponent {
  constructor() {}

  private authService = inject(AuthService);

  user = computed(() => this.authService.user());

  getUser() {
    console.log(this.user());
  }

  logOut() {
    this.authService.logout();
  }
}

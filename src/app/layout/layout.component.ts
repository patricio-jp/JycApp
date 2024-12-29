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
  IonButton,
  IonIcon,
  IonPopover,
  PopoverController,
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import { logOutOutline, personCircle } from 'ionicons/icons';
import { PopoverComponent } from '../components/popover/popover.component';

@Component({
  selector: 'app-layout',
  templateUrl: 'layout.component.html',
  styleUrls: ['layout.component.scss'],
  standalone: true,
  imports: [
    IonPopover,
    IonIcon,
    IonButton,
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
  constructor() {
    addIcons({ personCircle, logOutOutline });
  }

  private popoverCtrl = inject(PopoverController);
  private authService = inject(AuthService);

  user = computed(() => this.authService.user());

  getUser() {
    console.log(this.user());
  }

  async popoverUser(e: Event) {
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      event: e,
      componentProps: {
        data: {
          content: `<h3 class="font-bold">${
            this.user()?.apellido + ', ' + this.user()?.nombre
          }</h3>
                <p>${this.user()?.rol}</p>
                <hr class="my-2">`,
          buttons: [
            {
              text: 'Cerrar Sesión',
              icon: {
                slot: 'start',
                icon: 'log-out-outline',
              },
              action: 'close',
              color: 'primary',
            },
          ],
        },
      },
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (data?.action === 'close') {
      this.logOut();
    }
  }

  logOut() {
    this.authService.logout();
  }
}

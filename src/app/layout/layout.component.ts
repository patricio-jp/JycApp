import { Component, computed, inject, OnInit } from '@angular/core';
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
  IonMenuToggle,
  IonList,
  IonItem,
  IonLabel,
  IonRouterOutlet,
  IonButton,
  IonIcon,
  PopoverController,
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import {
  cash,
  cashOutline,
  close,
  closeOutline,
  cube,
  cubeOutline,
  hammer,
  hammerOutline,
  home,
  homeOutline,
  logOutOutline,
  people,
  peopleOutline,
  personCircle,
  pricetags,
  pricetagsOutline,
} from 'ionicons/icons';
import { PopoverComponent } from '../components/popover/popover.component';
import { navLinks } from '../constants/navigation';

@Component({
  selector: 'app-layout',
  templateUrl: 'layout.component.html',
  styleUrls: ['layout.component.scss'],
  standalone: true,
  imports: [
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
    IonMenuToggle,
    IonButtons,
    IonMenuButton,
    RouterLink,
    IonRouterOutlet,
  ],
})
export class LayoutComponent implements OnInit {
  constructor() {
    addIcons({
      personCircle,
      logOutOutline,
      home,
      homeOutline,
      cash,
      cashOutline,
      people,
      peopleOutline,
      pricetags,
      pricetagsOutline,
      cube,
      cubeOutline,
      hammer,
      hammerOutline,
      close,
      closeOutline,
    });
  }

  private popoverCtrl = inject(PopoverController);
  private authService = inject(AuthService);

  appPages = navLinks;
  selectedIndex: number = 0;

  user = computed(() => this.authService.user());

  ngOnInit(): void {
    this.selectedIndex = this.appPages.findIndex(
      (page) => page.url === window.location.pathname
    );
  }

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

import { Component, inject, Input } from '@angular/core';
import { Share } from '@capacitor/share';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  ModalController,
  IonImg,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { shareOutline } from 'ionicons/icons';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonImg,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
  ],
})
export class ImageViewerComponent {
  @Input() image?: string;

  private modalCtrl = inject(ModalController);

  constructor() {
    addIcons({ shareOutline });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async shareImage() {
    if (this.image) {
      await Share.share({
        url: this.image,
      });
    }
  }
}

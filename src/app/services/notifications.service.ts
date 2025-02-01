import { inject, Injectable, signal } from '@angular/core';
import {
  AlertController,
  ToastController,
  ToastButton,
} from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentToast(
    message: string,
    duration: number = 3000,
    buttons?: ToastButton[]
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position: 'top',
      buttons,
    });

    await toast.present();
  }

  async presentErrorToast(
    message: string,
    duration: number = 3000,
    buttons?: ToastButton[]
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position: 'top',
      buttons,
      color: 'danger',
    });

    await toast.present();
  }

  async presentWarningToast(
    message: string,
    duration: number = 3000,
    buttons?: ToastButton[]
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position: 'top',
      buttons,
      color: 'warning',
    });

    await toast.present();
  }

  async presentSuccessToast(
    message: string,
    duration: number = 3000,
    buttons?: ToastButton[]
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position: 'top',
      buttons,
      color: 'success',
    });

    await toast.present();
  }
}

import { inject, Injectable, signal } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular/standalone';

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

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
    });

    await toast.present();
  }

  async presentErrorToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color: 'danger',
    });

    await toast.present();
  }

  async presentWarningToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color: 'warning',
    });

    await toast.present();
  }

  async presentSuccessToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color: 'success',
    });

    await toast.present();
  }
}

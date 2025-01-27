import { inject, Injectable, signal } from '@angular/core';
import { LoadingController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class LoadingIndicatorService {
  private isLoading = signal<boolean>(false);
  private loadingElement: HTMLIonLoadingElement | null = null;
  private loadingCuont = 0;

  private loadingCtrl = inject(LoadingController);

  async loadingOn() {
    this.isLoading.set(true);
    this.loadingCuont++;
    if (this.loadingCuont === 1) {
      await this.createLoading();
    }
  }

  private async createLoading() {
    this.loadingElement = await this.loadingCtrl.create({
      message: 'Cargando...',
    });
    this.loadingElement.present();
  }

  async loadingOff() {
    this.isLoading.set(false);
    this.loadingCuont--;
    if (this.loadingElement && this.loadingCuont === 0) {
      await this.loadingElement.dismiss();
    }
  }
}

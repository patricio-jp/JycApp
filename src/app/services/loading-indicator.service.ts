import { inject, Injectable, signal } from '@angular/core';
import { LoadingController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class LoadingIndicatorService {
  isLoading = signal<boolean>(false);
  private loadingElement: HTMLIonLoadingElement | null = null;
  private loadingCount = 0;
  private timeoutId: any = null;

  private loadingCtrl = inject(LoadingController);

  async loadingOn() {
    this.isLoading.set(true);
    this.loadingCount++;
    if (this.loadingCount === 1) {
      await this.createLoading();
    }
    this.startTimeout(); // Restart timeout at each stacked loading
  }

  private async createLoading() {
    this.loadingElement = await this.loadingCtrl.create({
      message: 'Cargando...',
    });
    this.loadingElement.present();
  }

  private startTimeout() {
    this.clearTimeout();
    this.timeoutId = setTimeout(async () => {
      if (this.loadingElement) {
        await this.loadingElement.dismiss();
        this.loadingElement = null;
        this.isLoading.set(false);
        this.loadingCount = 0;
      }
    }, 10000); // 10 seconds
  }

  private clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  async loadingOff() {
    this.loadingCount--;
    if (this.loadingCount === 0) {
      this.isLoading.set(false);
      this.clearTimeout(); // Clear timeout only if the last one is dismissed
      if (this.loadingElement) {
        await this.loadingElement.dismiss();
        this.loadingElement = null;
      }
    }
  }
}

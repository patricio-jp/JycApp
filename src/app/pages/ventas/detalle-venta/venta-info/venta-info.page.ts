import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonTitle,
  ModalController,
  IonIcon,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import {
  CondicionOperacion,
  EstadoOperacion,
  Venta,
} from 'src/app/interfaces/operaciones';
import { Periodo, EstadoCredito, Credito } from 'src/app/interfaces/credito';
import { CreditoInfoComponent } from 'src/app/pages/creditos/detalle-credito/credito-info/credito-info.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FileService } from 'src/app/services/files.service';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';
import { addIcons } from 'ionicons';
import { imageOutline } from 'ionicons/icons';

@Component({
  selector: 'app-venta-info',
  templateUrl: './venta-info.page.html',
  styleUrls: ['./venta-info.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonTitle,
    FaIconComponent,
  ],
})
export class VentaInfoPage implements OnInit, OnDestroy {
  @Input() venta?: Venta;
  blobComprobante?: string;

  private modalCtrl = inject(ModalController);
  private router = inject(Router);
  private httpClient = inject(HttpClient);
  private filesService = inject(FileService);

  condicionVenta = CondicionOperacion;
  estadosVenta = EstadoOperacion;
  periodosCredito = Periodo;
  estadosCredito = EstadoCredito;

  private subscriptions = new Subscription();

  constructor() {
    addIcons({ imageOutline });
  }

  ngOnInit(): void {
    console.log(this.venta);
    if (this.venta?.comprobanteUrl) {
      this.subscriptions.add(
        this.filesService
          .getFileFromServer(this.venta.comprobanteUrl)
          .subscribe(
            (blob) => {
              this.blobComprobante = URL.createObjectURL(blob);
            },
            (error) => {
              console.error('Error al cargar la imagen del comprobante');
            }
          )
      );
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async showComprobante(comprobanteBlob: string) {
    const modal = await this.modalCtrl.create({
      id: 'imageModal',
      component: ImageViewerComponent,
      componentProps: { image: comprobanteBlob },
      breakpoints: [0.5, 1],
      initialBreakpoint: 1,
    });
    //console.log(credito);
    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }

  async viewCreditoDetails(credito: Credito) {
    if (credito) {
      const modal = await this.modalCtrl.create({
        id: 'creditoModal',
        component: CreditoInfoComponent,
        componentProps: { credito },
        breakpoints: [0.25, 0.5, 1],
        initialBreakpoint: 0.25,
      });
      //console.log(credito);
      modal.present();

      const { data, role } = await modal.onWillDismiss();
    } else {
      alert('No crédito');
    }
    //console.log(data, role);
  }

  cargarPagoACredito(credito: Credito) {
    this.router.navigate(['./dashboard/creditos/cargar-pago'], {
      state: { credito },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCardHeader,
  IonCard,
  IonCardTitle,
  IonCardContent,
  ModalController,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VentasService } from 'src/app/services/ventas.service';
import {
  CondicionOperacion,
  EstadoOperacion,
  Venta,
} from 'src/app/interfaces/operaciones';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Credito, EstadoCredito, Periodo } from 'src/app/interfaces/credito';
import { CreditoInfoComponent } from '../../creditos/detalle-credito/credito-info/credito-info.component';
import { Subscription } from 'rxjs';
import { FileService } from 'src/app/services/files.service';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.page.html',
  styleUrls: ['./detalle-venta.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCardHeader,
    IonCard,
    IonCardTitle,
    IonCardContent,
    RouterLink,
    CommonModule,
    FormsModule,
    FaIconComponent,
  ],
})
export class DetalleVentaPage implements OnDestroy {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private ventasService = inject(VentasService);
  private modalCtrl = inject(ModalController);
  private subscriptions = new Subscription();
  private filesService = inject(FileService);

  venta: Venta | undefined;
  condicionVenta = CondicionOperacion;
  estadosVenta = EstadoOperacion;
  periodosCredito = Periodo;
  estadosCredito = EstadoCredito;

  blobComprobante?: string;

  constructor() {
    const ventaID = Number(this.route.snapshot.params['id']);
    this.subscriptions.add(
      this.ventasService.getVenta(ventaID).subscribe((venta) => {
        this.venta = venta;
        this.loadComprobante();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async viewCreditoDetails(credito: Credito) {
    const modal = await this.modalCtrl.create({
      component: CreditoInfoComponent,
      componentProps: { credito },
      breakpoints: [0.25, 0.5, 1],
      initialBreakpoint: 0.25,
    });
    //console.log(credito);
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    //console.log(data, role);
  }

  viewDesktopCreditoDetails(id?: number) {
    this.router.navigate(['./creditos/detalle', id]);
  }

  cargarPagoACredito(credito: Credito) {
    this.router.navigate(['./creditos/cargar-pago'], {
      state: { credito },
    });
  }

  loadComprobante() {
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
}

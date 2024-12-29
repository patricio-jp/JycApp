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

  venta: Venta | undefined;
  condicionVenta = CondicionOperacion;
  estadosVenta = EstadoOperacion;
  periodosCredito = Periodo;
  estadosCredito = EstadoCredito;

  constructor() {
    const ventaID = Number(this.route.snapshot.params['id']);
    this.subscriptions.add(
      this.ventasService
        .getVenta(ventaID)
        .subscribe((venta) => (this.venta = venta))
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
    this.router.navigate(['./dashboard/creditos/detalle', id]);
  }

  cargarPagoACredito(credito: Credito) {
    this.router.navigate(['./dashboard/creditos/cargar-pago'], {
      state: { credito },
    });
  }
}

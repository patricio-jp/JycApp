import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ModalController,
  IonButton,
  IonIcon,
  IonInput,
} from '@ionic/angular/standalone';
import {
  CargarPagoDTO,
  Credito,
  EstadoCredito,
  EstadoCuota,
  Periodo,
} from 'src/app/interfaces/credito';
import { CreditoSelectorComponent } from './credito-selector/credito-selector.component';
import { CreditosService } from 'src/app/services/creditos.service';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-cargar-pago',
  templateUrl: './cargar-pago.page.html',
  styleUrls: ['./cargar-pago.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonInput,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class CargarPagoPage implements OnInit, OnDestroy {
  @Input() credito?: Credito;

  constructor() {
    addIcons({ search });
  }

  ngOnInit() {
    this.populateCreditoByRouter();
  }

  ionViewDidEnter() {
    this.populateCreditoByRouter();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  populateCreditoByRouter() {
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras.state) {
      this.credito = navigation.extras.state['credito'];
      if (this.credito) {
        this.selectedCredito = this.credito;
        this.nuevoPago.patchValue({
          creditoId: this.credito.id,
          credito: this.credito?.venta.comprobante,
        });
      }
    }
  }

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private modalCtrl = inject(ModalController);

  private creditosService = inject(CreditosService);
  private notificationsService = inject(NotificationsService);

  private subscriptions = new Subscription();

  selectedCredito?: Credito;
  estadosCreditos = EstadoCredito;
  periodos = Periodo;
  estadosCuota = EstadoCuota;

  nuevoPago = this.formBuilder.group({
    monto: [0, Validators.min(0.01)],
    creditoId: [0, Validators.required],
    credito: [''],
    fechaPago: [new Date().toISOString().substring(0, 10)],
  });

  async searchCredito() {
    const modalCredito = await this.modalCtrl.create({
      component: CreditoSelectorComponent,
      componentProps: { credito: this.selectedCredito },
    });

    modalCredito.present();

    const { data, role } = await modalCredito.onWillDismiss();
    if (role === 'confirm' && data) {
      this.selectedCredito = data;
      this.nuevoPago.patchValue({
        creditoId: this.selectedCredito?.id ?? null,
        credito: this.selectedCredito?.venta.comprobante ?? null,
      });
    }
  }

  resetCredito(): void {
    this.selectedCredito = undefined;
    this.nuevoPago.patchValue({
      creditoId: null,
    });
  }

  resetPago(): void {
    this.selectedCredito = undefined;
    this.nuevoPago.reset();
  }

  async cargarPago() {
    if (this.nuevoPago.valid) {
      try {
        console.log(this.nuevoPago.value);
        const pago: CargarPagoDTO = {
          monto: Number(this.nuevoPago.get('monto')?.value),
          fechaPago: this.nuevoPago.get('fecha')?.value,
          creditoId:
            this.nuevoPago.get('creditoId')?.value ||
            this.selectedCredito?.id ||
            0,
        };
        this.subscriptions.add(
          this.creditosService.cargarPago(pago).subscribe(async (credito) => {
            this.notificationsService.presentSuccessToast(
              'Pago cargado exitosamente'
            );
            this.creditosService.getCreditos();
            this.nuevoPago.reset();
            this.router.navigate(['./dashboard/creditos/listado']);
          })
        );
      } catch (error) {
        this.notificationsService.presentErrorToast('Error al cargar el pago');
      }
    } else {
      this.notificationsService.presentWarningToast(
        'Formulario inválido. Complete los campos requeridos'
      );
    }
  }
}

import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ModalController,
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
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationsService } from 'src/app/services/notifications.service';
import { FormaPago, Ingreso, Recibo } from 'src/app/interfaces/ingreso';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { VerReciboComponent } from '../../ingresos/ver-recibo/ver-recibo.component';

@Component({
  selector: 'app-cargar-pago',
  templateUrl: './cargar-pago.page.html',
  styleUrls: ['./cargar-pago.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonInput,
    CommonModule,
    ReactiveFormsModule,
    FaIconComponent,
  ],
})
export class CargarPagoPage implements OnInit, OnDestroy {
  @Input() credito?: Credito;

  constructor() {}

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
    formaPago: [FormaPago.Efectivo, Validators.required],
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
        //console.log(this.nuevoPago.value);
        const pago: CargarPagoDTO = {
          monto: Number(this.nuevoPago.get('monto')?.value),
          formaPago: Number(this.nuevoPago.get('formaPago')?.value),
          fechaPago: this.nuevoPago.get('fechaPago')?.value
            ? new Date(this.nuevoPago.get('fechaPago')?.value as string)
            : undefined,
          creditoId:
            this.nuevoPago.get('creditoId')?.value ||
            this.selectedCredito?.id ||
            0,
        };
        this.subscriptions.add(
          this.creditosService
            .cargarPago(pago)
            .subscribe(async (ingreso: Ingreso) => {
              if (ingreso) {
                this.notificationsService.presentSuccessToast(
                  'Pago cargado exitosamente',
                  3000,
                  [
                    {
                      handler: () => this.verRecibo(ingreso),
                      text: 'Ver recibo',
                    },
                  ]
                );
                this.creditosService.getCreditos();
                this.nuevoPago.reset();
              }
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

  async verRecibo(ingreso: Ingreso): Promise<void> {
    //console.log(ingreso);
    const modalCredito = await this.modalCtrl.create({
      component: VerReciboComponent,
      componentProps: {
        recibo: {
          ...ingreso.recibo,
          ingreso: ingreso,
        },
      },
      initialBreakpoint: 1,
      breakpoints: [0.5, 1],
    });

    modalCredito.present();
    const { data, role } = await modalCredito.onWillDismiss();
    this.router.navigate(['./dashboard/creditos/listado']);
  }
}

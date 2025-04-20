import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  ActionSheetButton,
  ActionSheetController,
  ModalController,
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { Ingreso } from 'src/app/interfaces/ingreso';
import { IngresosService } from 'src/app/services/ingresos.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-editar-ingreso',
  templateUrl: './editar-ingreso.component.html',
  styleUrls: ['./editar-ingreso.component.scss'],
  standalone: true,
    imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    CommonModule,
    ReactiveFormsModule
],
})
export class EditarIngresoComponent  implements OnInit {

  @Input() ingreso?: Ingreso;
  @Input() fullEdit: boolean = true;

  private ingresosService = inject(IngresosService);
  private actionSheetCtrl = inject(ActionSheetController);
  private modalCtrl = inject(ModalController);
  private notificationsService = inject(NotificationsService);

  private formBuilder = inject(FormBuilder);
  private subscriptions = new Subscription();

  dataIngreso = this.formBuilder.group({
    id: [0, Validators.required],
    fecha: [new Date().toISOString().substring(0, 10), Validators.required],
    concepto: ['', Validators.required],
    importe: [0, Validators.required],
    formaPago: [0, Validators.required],
    estado: [0, Validators.required],
    cliente_id: [0, Validators.required],
  });

  constructor() { }

  ngOnInit() {
    if (!this.ingreso) return;
    this.dataIngreso.patchValue({
      id: this.ingreso.id,
      fecha: new Date(this.ingreso.fecha).toISOString().substring(0, 10),
      concepto: this.ingreso.concepto,
      importe: Number(this.ingreso.importe),
      formaPago: Number(this.ingreso.formaPago),
      estado: Number(this.ingreso.estado),
      cliente_id: this.ingreso.recibo.cliente.id,
    });
  }

  confirm() {
    if (this.dataIngreso.touched) {
      if (!this.dataIngreso.valid) {
        this.notificationsService.presentWarningToast('Por favor, complete todos los campos obligatorios.');
        return;
      }

      this.dataIngreso.value.formaPago = Number(this.dataIngreso.value.formaPago);
      this.dataIngreso.value.estado = Number(this.dataIngreso.value.estado);
      this.dataIngreso.value.fecha = this.dataIngreso.value.fecha
        ? new Date(this.dataIngreso.value.fecha).toISOString().substring(0, 10)
        : new Date().toISOString().substring(0, 10);
      this.dataIngreso.value.concepto = this.dataIngreso.value.concepto?.trim();
      return this.modalCtrl.dismiss(this.dataIngreso.value, 'confirm');
    }
    this.notificationsService.presentWarningToast('No se han realizado cambios en el ingreso.');
    return this.cancel();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}

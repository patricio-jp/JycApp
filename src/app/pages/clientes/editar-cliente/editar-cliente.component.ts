import { Component, inject, Input, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonTitle,
  IonLabel,
  ModalController,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Cliente } from 'src/app/interfaces/cliente';
import { ClientesService } from 'src/app/services/clientes.service';
import { Subscription } from 'rxjs';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonTitle,
    IonLabel,
    FaIconComponent,
  ],
})
export class EditarClienteComponent implements OnInit {
  @Input() cliente!: Cliente;

  private clientesService = inject(ClientesService);
  private formBuilder = inject(FormBuilder);

  private suscriptions = new Subscription();

  modalCtrl = inject(ModalController);

  constructor() {}

  ngOnInit(): void {
    this.dataCliente.patchValue({
      id: this.cliente.id,
      dni: this.cliente.dni,
      nombre: this.cliente.nombre,
      apellido: this.cliente.apellido,
      fechaNacimiento: this.cliente.fechaNacimiento,
      observaciones: this.cliente.observaciones,
      estado: this.cliente.estado,
      id_zona: this.cliente.zona?.id,
    });
    this.populateDomicilios();
    this.populateTelefonos();
  }

  dataCliente = this.formBuilder.group({
    id: [0, Validators.required],
    dni: [0, Validators.required],
    nombre: ['', Validators.required],
    apellido: [''],
    fechaNacimiento: [new Date()],
    domicilios: this.formBuilder.array([]),
    telefonos: this.formBuilder.array([]),
    id_zona: [0],
    observaciones: [''],
    estado: [0],
  });

  get domicilios() {
    return this.dataCliente.get('domicilios') as FormArray;
  }

  get telefonos() {
    return this.dataCliente.get('telefonos') as FormArray;
  }

  addDomicilio() {
    this.domicilios.push(
      this.formBuilder.group({
        direccion: [''],
        barrio: [''],
        localidad: [''],
      })
    );
  }

  addTelefono() {
    this.telefonos.push(
      this.formBuilder.group({
        telefono: [''],
      })
    );
  }

  populateDomicilios() {
    this.cliente.domicilios!.forEach((domicilio) => {
      this.domicilios.push(
        this.formBuilder.group({
          id: [domicilio.id ? domicilio.id : undefined],
          direccion: [domicilio.direccion ? domicilio.direccion : ''],
          barrio: [domicilio.barrio ? domicilio.barrio : ''],
          localidad: [domicilio.localidad ? domicilio.localidad : ''],
        })
      );
    });
  }

  populateTelefonos() {
    this.cliente.telefonos!.forEach((telefono) => {
      this.telefonos.push(
        this.formBuilder.group({
          id: telefono.id ? telefono.id : undefined,
          telefono: telefono.telefono,
        })
      );
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.dataCliente.value.fechaNacimiento === null)
      this.dataCliente.value.fechaNacimiento = undefined;
    this.dataCliente.value.estado = Number(this.dataCliente.value.estado);
    return this.modalCtrl.dismiss(this.dataCliente.value, 'confirm');
  }
}

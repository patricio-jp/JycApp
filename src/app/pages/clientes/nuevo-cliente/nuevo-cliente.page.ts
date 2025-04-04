import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  Cliente,
  CreateClienteDTO,
  EstadoCliente,
} from 'src/app/interfaces/cliente';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { ClientesService } from 'src/app/services/clientes.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.page.html',
  styleUrls: ['./nuevo-cliente.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class NuevoClientePage implements OnDestroy {
  constructor() {
    addIcons({ trashOutline });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscriptions = new Subscription();

  private formBuilder = inject(FormBuilder);
  private clientesService = inject(ClientesService);
  private notificationsService = inject(NotificationsService);
  private router = inject(Router);

  nuevoCliente = this.formBuilder.group({
    dni: [null, Validators.required],
    nombre: ['', Validators.required],
    apellido: [''],
    fechaNacimiento: [new Date().toISOString()],
    domicilios: this.formBuilder.array([
      this.formBuilder.group({
        direccion: [''],
        barrio: [''],
        localidad: [''],
      }),
    ]),
    telefonos: this.formBuilder.array([
      this.formBuilder.group({
        telefono: [''],
      }),
    ]),
    id_zona: [null, Validators.required],
    observaciones: [''],
    estado: [EstadoCliente.Activo],
  });

  get domicilios() {
    return this.nuevoCliente.get('domicilios') as FormArray;
  }

  get telefonos() {
    return this.nuevoCliente.get('telefonos') as FormArray;
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

  guardarCliente() {
    console.log(this.nuevoCliente.value);
    if (this.nuevoCliente.dirty && this.nuevoCliente.valid) {
      const cliente: CreateClienteDTO = {
        dni: this.nuevoCliente.value.dni ?? 0,
        nombre: this.nuevoCliente.value.nombre ?? '',
        apellido: this.nuevoCliente.value.apellido ?? '',
        fechaNacimiento: new Date(
          this.nuevoCliente.value.fechaNacimiento ?? ''
        ),
        domicilios:
          this.nuevoCliente.value.domicilios?.map((domicilio: any) => ({
            direccion: domicilio.direccion ?? '',
            barrio: domicilio.barrio ?? '',
            localidad: domicilio.localidad ?? '',
          })) ?? [],
        telefonos:
          this.nuevoCliente.value.telefonos?.map((telefono: any) => ({
            telefono: telefono.telefono ?? '',
          })) ?? [],
        id_zona: this.nuevoCliente.value.id_zona ?? 0,
        estado: this.nuevoCliente.value.estado ?? 0,
        observaciones: this.nuevoCliente.value.observaciones ?? '',
      };
      this.subscriptions.add(
        this.clientesService.createCliente(cliente).subscribe((newCliente) => {
          this.notificationsService.presentSuccessToast(
            'Cliente creado exitosamente'
          );
          //console.log(newCliente);
          this.clientesService.getClientes();
          this.nuevoCliente.reset();
          this.router.navigate(['./dashboard/clientes/listado']);
        })
      );
    } else {
      this.notificationsService.presentWarningToast(
        'Por favor complete los campos obligatorios'
      );
    }
  }

  resetForm() {
    this.nuevoCliente.reset();
  }
}

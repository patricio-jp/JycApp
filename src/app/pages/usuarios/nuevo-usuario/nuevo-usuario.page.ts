import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Subscription } from 'rxjs';
import { NotificationsService } from 'src/app/services/notifications.service';
import { CreateUsuarioDTO } from 'src/app/interfaces/usuario';
import { Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.page.html',
  styleUrls: ['./nuevo-usuario.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    ReactiveFormsModule,
    FaIconComponent,
  ],
})
export class NuevoUsuarioPage implements OnDestroy {
  private subscriptions = new Subscription();

  private formBuilder = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);
  private notificationsService = inject(NotificationsService);
  private router = inject(Router);

  constructor() {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  nuevoUsuario = this.formBuilder.group({
    dni: [null, Validators.required],
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    fechaNacimiento: [
      new Date().toISOString().substring(0, 10),
      Validators.required,
    ],
    fechaInicio: [
      new Date().toISOString().substring(0, 10),
      Validators.required,
    ],
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
    rol: [null, Validators.required],
    observaciones: [''],
  });

  get domicilios() {
    return this.nuevoUsuario.get('domicilios') as FormArray;
  }

  get telefonos() {
    return this.nuevoUsuario.get('telefonos') as FormArray;
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

  guardarUsuario() {
    console.log(this.nuevoUsuario.value);
    if (this.nuevoUsuario.dirty && this.nuevoUsuario.valid) {
      const usuario: CreateUsuarioDTO = {
        dni: this.nuevoUsuario.value.dni ?? 0,
        nombre: this.nuevoUsuario.value.nombre ?? '',
        apellido: this.nuevoUsuario.value.apellido ?? '',
        password: this.nuevoUsuario.value.password ?? '',
        confirmPassword: this.nuevoUsuario.value.confirmPassword ?? '',
        fechaNacimiento: new Date(
          this.nuevoUsuario.value.fechaNacimiento ?? ''
        ),
        fechaInicio: new Date(this.nuevoUsuario.value.fechaInicio ?? ''),
        rol: Number(this.nuevoUsuario.value.rol) ?? 0,
        domicilios:
          this.nuevoUsuario.value.domicilios?.map((domicilio: any) => ({
            direccion: domicilio.direccion ?? '',
            barrio: domicilio.barrio ?? '',
            localidad: domicilio.localidad ?? '',
          })) ?? [],
        telefonos:
          this.nuevoUsuario.value.telefonos?.map((telefono: any) => ({
            telefono: telefono.telefono ?? '',
          })) ?? [],
        observaciones: this.nuevoUsuario.value.observaciones ?? '',
      };
      this.subscriptions.add(
        this.usuariosService.createUsuario(usuario).subscribe((newUser) => {
          this.notificationsService.presentSuccessToast(
            'Usuario creado exitosamente'
          );
          //console.log(newUser);
          this.usuariosService.getUsuarios();
          this.nuevoUsuario.reset();
          this.router.navigate(['./usuarios/listado']);
        })
      );
    } else {
      this.notificationsService.presentWarningToast(
        'Por favor complete los campos obligatorios'
      );
    }
  }

  resetForm() {
    this.nuevoUsuario.reset();
  }
}

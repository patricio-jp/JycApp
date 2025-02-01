import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  ModalController,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
} from '@ionic/angular/standalone';
import { EstadoCarton } from 'src/app/interfaces/carton';
import { Credito } from 'src/app/interfaces/credito';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-estado-carton',
  templateUrl: './estado-carton.component.html',
  styleUrls: ['./estado-carton.component.scss'],
  standalone: true,
  imports: [
    IonDatetime,
    IonModal,
    IonDatetimeButton,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    ReactiveFormsModule,
  ],
})
export class EstadoCartonComponent implements OnInit {
  @Input() credito?: Credito;

  get carton() {
    return this.credito!.carton;
  }

  get grupoCarton() {
    return this.credito!.carton.grupoCartones!.cartones;
  }

  private modalCtrl = inject(ModalController);
  private notificationsService = inject(NotificationsService);

  estadosCartones = EstadoCarton;

  estadoNuevo = new FormGroup({
    estado: new FormControl(0, [Validators.required]),
    fechaCarton: new FormControl(null),
    actualizarGrupo: new FormControl(false),
  });

  constructor() {}

  ngOnInit(): void {
    console.log(this.credito);
    this.estadoNuevo.patchValue({
      estado: this.carton.estado,
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(undefined, 'cancel');
  }

  confirm() {
    //console.log(this.estadoNuevo);
    if (this.estadoNuevo.touched && this.estadoNuevo.dirty) {
      return this.modalCtrl.dismiss(this.estadoNuevo.value, 'confirm');
    } else {
      this.notificationsService.presentWarningToast(
        'No se hicieron cambios. Cancelando'
      );
      return this.modalCtrl.dismiss();
    }
  }
}

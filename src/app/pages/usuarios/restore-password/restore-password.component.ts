import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
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
} from '@ionic/angular/standalone';
import { catchError, Subscription } from 'rxjs';
import {
  RestorePasswordDTO,
  SelfRestorePasswordDTO,
  Usuario,
} from 'src/app/interfaces/usuario';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
  ],
})
export class RestorePasswordComponent implements OnInit, OnDestroy {
  @Input() usuario?: Usuario;
  @Input() isSelfRestore: boolean = false;
  @Input() isModal: boolean = true;

  private modalCtrl = inject(ModalController);
  private notificationsService = inject(NotificationsService);
  private usuariosService = inject(UsuariosService);

  private subscriptions = new Subscription();
  private formBuilder = inject(FormBuilder);

  passwordForm: FormGroup = this.formBuilder.group({
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  constructor() {}

  ngOnInit(): void {
    if (this.isSelfRestore) {
      this.passwordForm.addControl(
        'oldPassword',
        this.formBuilder.control('', Validators.required)
      );
    }
  }

  savePassword() {
    if (this.passwordForm.valid && this.usuario?.id) {
      const password = this.passwordForm.get('password')?.value;
      const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
      const oldPassword = this.isSelfRestore
        ? this.passwordForm.get('oldPassword')?.value
        : undefined;

      if (password !== confirmPassword) {
        this.notificationsService.presentErrorToast(
          'Las contraseñas no coinciden'
        );
        return;
      }

      const parsedData = oldPassword
        ? ({
            oldPassword,
            password,
            confirmPassword,
          } as SelfRestorePasswordDTO)
        : ({
            password,
            confirmPassword,
          } as RestorePasswordDTO);

      this.subscriptions.add(
        this.usuariosService
          .restorePassword(this.usuario.id, parsedData)
          .pipe(
            catchError((error) => {
              this.notificationsService.presentErrorToast(error.error.message);
              return this.modalCtrl.dismiss(null, 'error');
            })
          )
          .subscribe((response) => {
            this.notificationsService.presentSuccessToast(
              'Contraseña actualizada correctamente'
            );
            this.usuariosService.getUsuarios();
            return this.modalCtrl.dismiss(null, 'confirm');
          })
      );
    } else {
      this.notificationsService.presentErrorToast(
        'Por favor, complete todos los campos requeridos'
      );
      return;
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

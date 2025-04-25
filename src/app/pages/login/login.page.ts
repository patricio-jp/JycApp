import { Component, DestroyRef, inject, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  ActionSheetController,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Login } from 'src/app/interfaces/login';
import { Subscription } from 'rxjs';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonContent,
    ReactiveFormsModule,
  ],
})
export class LoginPage implements OnDestroy {
  constructor() {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  router = inject(Router);

  private notificationsService = inject(NotificationsService);
  private actionSheetCtrl = inject(ActionSheetController);
  private authService = inject(AuthService);
  private usersService = inject(UsuariosService);
  private readonly destroyRef = inject(DestroyRef);

  private subscriptions = new Subscription();

  loginForm = new FormGroup({
    dni: new FormControl<number | null>(null, [Validators.required]),
    password: new FormControl<string | null>(null, [Validators.required]),
  });

  login() {
    if (!this.loginForm.valid) {
      return;
    }
    //console.log(this.loginForm);
    this.subscriptions.add(
      this.authService
        .login(this.loginForm.value as Login)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe()
    );
  }

  async askToRestorePassword() {
    const dni = this.loginForm.get('dni')?.value;
    if (!dni) {
      this.notificationsService.presentErrorToast(
        'Por favor, complete el campo DNI'
      );
      return;
    }

    this.subscriptions.add(
      this.usersService.askForPasswordReset(dni).subscribe()
    );
  }

  async showActionSheet() {
    const sheet = await this.actionSheetCtrl.create({
      header: '¿Olvidaste tu contraseña?',
      buttons: [
        {
          text: 'Restablecer contraseña',
          role: 'confirm',
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });
    await sheet.present();

    const { role } = await sheet.onWillDismiss();

    if (role === 'confirm') this.askToRestorePassword();
  }
}

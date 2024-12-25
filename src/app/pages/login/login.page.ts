import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Login } from 'src/app/interfaces/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonContent,
    IonButton,
    ReactiveFormsModule,
  ],
})
export class LoginPage {
  constructor() {}

  router = inject(Router);

  private authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  loginForm = new FormGroup({
    dni: new FormControl<number | null>(null, [Validators.required]),
    password: new FormControl<string | null>(null, [Validators.required]),
  });

  login() {
    if (!this.loginForm.valid) {
      return;
    }
    //console.log(this.loginForm);
    this.authService
      .login(this.loginForm.value as Login)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}

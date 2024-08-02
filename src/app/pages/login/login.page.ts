import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonCard,
  IonRow,
  IonGrid,
  IonCol,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { LoginInfo } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonText,
    IonInput,
    IonLabel,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCol,
    IonGrid,
    IonRow,
    IonCard,
    IonContent,
    IonItem,
    IonButton,
  ],
})
export class LoginPage {
  constructor() {}

  router = inject(Router);

  loginForm = new FormGroup({
    dni: new FormControl<number | null>(null, [Validators.required]),
    password: new FormControl<string | null>(null, [Validators.required]),
  });

  login() {
    this.router.navigate(['/dashboard']);
  }
}

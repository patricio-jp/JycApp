import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Cliente, EstadoCliente } from 'src/app/interfaces/cliente';
import { EstadoOperacion } from 'src/app/interfaces/operaciones';

@Component({
  selector: 'app-resumen-cliente',
  templateUrl: './resumen-cliente.component.html',
  styleUrls: ['./resumen-cliente.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    FaIconComponent,
  ],
})
export class ResumenClienteComponent {
  @Input() cliente!: Cliente;

  estadosCliente = EstadoCliente;
  estadosVenta = EstadoOperacion;

  constructor() {}
}

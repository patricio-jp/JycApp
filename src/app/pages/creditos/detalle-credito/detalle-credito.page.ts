import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { CreditosService } from 'src/app/services/creditos.service';
import {
  Credito,
  EstadoCredito,
  EstadoCuota,
  Periodo,
} from 'src/app/interfaces/credito';
import { CreditoInfoComponent } from './credito-info/credito-info.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detalle-credito',
  templateUrl: './detalle-credito.page.html',
  styleUrls: ['./detalle-credito.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    CreditoInfoComponent,
  ],
})
export class DetalleCreditoPage implements OnDestroy {
  route: ActivatedRoute = inject(ActivatedRoute);
  creditosService = inject(CreditosService);
  credito: Credito | undefined;

  private subscriptions = new Subscription();

  estadosCreditos = EstadoCredito;
  estadosCuota = EstadoCuota;
  periodos = Periodo;

  constructor() {
    const creditoId = Number(this.route.snapshot.params['id']);
    this.subscriptions.add(
      this.creditosService.getCredito(creditoId).subscribe((credito) => {
        this.credito = credito;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

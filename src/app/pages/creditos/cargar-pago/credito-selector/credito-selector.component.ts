import { Component, computed, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonTitle,
  ModalController,
  IonLabel,
  IonSearchbar,
  IonList,
  IonItem,
} from '@ionic/angular/standalone';
import {
  Credito,
  CreditosFilter,
  EstadoCredito,
  Periodo,
} from 'src/app/interfaces/credito';
import { CreditosService } from 'src/app/services/creditos.service';

@Component({
  selector: 'app-credito-selector',
  templateUrl: './credito-selector.component.html',
  styleUrls: ['./credito-selector.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonItem,
    IonList,
    IonSearchbar,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonTitle,
  ],
})
export class CreditoSelectorComponent {
  @Input() credito?: Credito;
  @ViewChild(IonContent) modalContent!: IonContent;

  private modalCtrl = inject(ModalController);
  private creditosService = inject(CreditosService);

  listadoCreditos = computed(() => this.creditosService.listadoCreditos());

  periodos = Periodo;

  constructor() {
    this.creditosService.getCreditos();
  }

  searchCredito($event: any) {
    const query = $event.target.value;
    const searchFilter: CreditosFilter = {
      searchTerm: query,
      estadoCredito: [EstadoCredito.Pendiente, EstadoCredito.Activo],
    };
    this.creditosService.getCreditos(0, 0, searchFilter);
  }

  select(credito: Credito) {
    this.credito = credito;
    this.modalContent.scrollToTop(500);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.credito, 'confirm');
  }
}

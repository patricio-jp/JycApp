import {
  AfterViewChecked,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonSpinner,
  IonSearchbar,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { EstadoCliente } from 'src/app/interfaces/cliente';
import { ClientesService } from 'src/app/services/clientes.service';
import { RouterLink } from '@angular/router';
import { Accordion } from 'flowbite';
import type { AccordionOptions, AccordionItem } from 'flowbite';
import { addIcons } from 'ionicons';
import { chevronUp } from 'ionicons/icons';

@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.page.html',
  styleUrls: ['./listado-clientes.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonSearchbar,
    IonSpinner,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonLoading,
    CommonModule,
    RouterLink,
  ],
})
export class ListadoClientesPage implements OnInit, AfterViewChecked {
  constructor() {
    addIcons({ chevronUp });
  }

  private clientesService = inject(ClientesService);

  dataClientes = computed(() => this.clientesService.dataClientes());
  listadoClientes = computed(() => this.clientesService.listadoClientes());
  loadingSignal = computed(() => this.clientesService.loadingSignal());

  accordion!: Accordion;

  estadoClientes = EstadoCliente;

  ngOnInit() {
    this.clientesService.getClientes();
  }

  ngAfterViewChecked(): void {
    const accordionContainer = document.getElementById('clientesBody');
    //console.log('Accordion Container:', accordionContainer);

    if (accordionContainer) {
      const accordionItems: AccordionItem[] = this.listadoClientes().map(
        (cliente) => {
          const triggerEl = document.getElementById(
            `cliente${cliente.id}Info`
          ) as HTMLElement;
          const targetEl = document.getElementById(
            `cliente${cliente.id}Detalle`
          ) as HTMLElement;
          /* console.log('Trigger Element:', triggerEl);
          console.log('Target Element:', targetEl); */

          return {
            id: `cliente${cliente.id}Info`,
            triggerEl: triggerEl,
            targetEl: targetEl,
            active: false,
          };
        }
      );

      const options: AccordionOptions = {
        activeClasses:
          'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white',
        inactiveClasses: 'bg-white dark:bg-gray-800',
      };

      this.accordion = new Accordion(
        accordionContainer,
        accordionItems,
        options
      );
      //console.log('Accordion Initialized:', this.accordion);
    }
  }

  toggleDetails(id?: number) {
    const idG = `cliente${id}Info`;
    //console.log('Toggling Details for ID:', idG);

    this.accordion.toggle(idG);
    //console.log('Accordion State after Toggle:', this.accordion);
  }
}

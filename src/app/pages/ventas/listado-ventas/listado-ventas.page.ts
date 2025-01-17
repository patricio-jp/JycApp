import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ModalController,
  IonPopover,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
} from '@ionic/angular/standalone';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { VentasService } from 'src/app/services/ventas.service';
import { Cliente } from 'src/app/interfaces/cliente';
import {
  CondicionOperacion,
  EstadoOperacion,
  Venta,
  VentasFilter,
} from 'src/app/interfaces/operaciones';
import { VentaInfoPage } from '../detalle-venta/venta-info/venta-info.page';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listado-ventas',
  templateUrl: './listado-ventas.page.html',
  styleUrls: ['./listado-ventas.page.scss'],
  standalone: true,
  imports: [
    IonDatetime,
    IonModal,
    IonDatetimeButton,
    IonPopover,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    RouterLink,
    FaIconComponent,
    FormsModule,
  ],
})
export class ListadoVentasPage implements OnInit {
  constructor() {}

  private ventasService = inject(VentasService);

  private modalCtrl = inject(ModalController);

  private router = inject(Router);

  estadosVenta = EstadoOperacion;

  dataVentas = computed(() => this.ventasService.dataVentas());
  listadoVentas = computed(() => this.ventasService.listadoVentas());
  loadingSignal = computed(() => this.ventasService.loadingSignal());

  actualPage: number = 1;
  pageSize: number = 10;
  totalPages = computed(() => {
    const totalVentas = this.dataVentas().count;
    return Math.ceil(totalVentas / this.pageSize);
  });
  arrayPages = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });
  itemsShowed = computed(() => {
    const start = (this.actualPage - 1) * this.pageSize + 1;
    const end = Math.min(
      this.actualPage * this.pageSize,
      this.dataVentas().count
    );
    return `${start} - ${end}`;
  });

  clienteFilter?: string;
  dateFilter?: any;
  estadoFilter?: EstadoOperacion;
  condicionFilter?: CondicionOperacion;
  productoFilter?: string;

  filters: VentasFilter = {};

  ngOnInit() {
    this.ventasService.getVentas(10, 1);
  }

  applyFiltersAndPagination() {
    this.ventasService.getVentas(this.pageSize, this.actualPage, this.filters);
  }

  searchVentas(event: any) {
    this.filters.searchTerm = event.target.value;
    this.applyFilters();
  }

  nextPage() {
    if (this.actualPage !== this.totalPages()) {
      this.actualPage++;
      this.applyFiltersAndPagination();
    }
  }

  previousPage() {
    if (this.actualPage > 1) {
      this.actualPage--;
      this.applyFiltersAndPagination();
    }
  }

  goToPage(page: number) {
    if (this.actualPage !== page) {
      this.actualPage = page;
      this.applyFiltersAndPagination();
    }
  }

  applyFilters() {
    this.filters = {
      ...this.filters,
      cliente: this.clienteFilter,
      fecha: this.dateFilter,
      estado: this.estadoFilter,
      condicion: this.condicionFilter,
      productos: this.productoFilter,
    };

    // Remove undefined values from filters
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(
        ([_, v]) => v !== undefined && v !== ''
      )
    );
    console.log(this.filters);
    this.actualPage = 1; // Reset to first page on new filter
    this.applyFiltersAndPagination();
  }

  clearFilters() {
    this.clienteFilter = undefined;
    this.dateFilter = undefined;
    this.estadoFilter = undefined;
    this.condicionFilter = undefined;
    this.productoFilter = undefined;
    this.filters = {};
    this.actualPage = 1; // Reset to first page on clear filters
    this.applyFiltersAndPagination();
  }

  async clientDetails(cliente: Cliente) {
    /* const modal = await this.modalCtrl.create({
      component: Cliente
    }) */
  }

  async ventaDetails(venta: Venta) {
    const modal = await this.modalCtrl.create({
      component: VentaInfoPage,
      componentProps: { venta: venta },
      breakpoints: [0.5, 1],
      initialBreakpoint: 0.5,
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }

  ventaDesktopDetails(id?: number) {
    this.router.navigate(['./dashboard/ventas/detalle', id]);
  }
}

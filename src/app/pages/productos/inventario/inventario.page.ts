import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPopover,
  ModalController,
  ActionSheetController,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto, ProductosFilter } from 'src/app/interfaces/producto';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ProductoInfoPage } from '../detalle-producto/producto-info/producto-info.page';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonPopover,
    CommonModule,
    FormsModule,
    RouterLink,
    FaIconComponent,
  ],
})
export class InventarioPage implements OnInit, OnDestroy {
  constructor() {}

  private productsService = inject(ProductosService);

  private modalCtrl = inject(ModalController);
  private actionSheetCtrl = inject(ActionSheetController);

  private router = inject(Router);
  private subscriptions = new Subscription();

  dataProductos = computed(() => this.productsService.dataProductos());
  listadoProductos = computed(() => this.productsService.listadoProductos());
  loadingSignal = computed(() => this.productsService.loadingSignal());

  actualPage = signal(1);
  pageSize: number = 10;
  totalPages = computed(() => {
    const totalProductos = this.dataProductos().count;
    return Math.ceil(totalProductos / this.pageSize);
  });
  arrayPages = computed(() => {
    const range = 3;
    const totalPages = this.totalPages();
    const currentPage = this.actualPage();

    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);

    const pages = [];

    if (start > 1) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      pages.push('...');
    }

    return pages;
  });
  itemsShowed = computed(() => {
    const start = (this.actualPage() - 1) * this.pageSize + 1;
    const end = Math.min(
      this.actualPage() * this.pageSize,
      this.dataProductos().count
    );
    return `${start} - ${end}`;
  });

  searchTerm?: string;
  elminadosFilter?: boolean;

  filters: ProductosFilter = {};

  ngOnInit() {
    this.productsService.getProductos(10, 1);
  }

  applyFiltersAndPagination() {
    this.productsService.getProductos(
      this.pageSize,
      this.actualPage(),
      this.filters
    );
  }

  searchProductos(event: any) {
    this.filters.searchTerm = event.target.value;
    this.applyFilters();
  }

  nextPage() {
    if (this.actualPage() < this.totalPages()) {
      this.actualPage.set(this.actualPage() + 1);
      this.applyFiltersAndPagination();
    }
  }

  previousPage() {
    if (this.actualPage() > 1) {
      this.actualPage.set(this.actualPage() - 1);
      this.applyFiltersAndPagination();
    }
  }

  goToPage(page: number) {
    if (this.actualPage() !== page) {
      this.actualPage.set(page);
      this.applyFiltersAndPagination();
    }
  }

  applyFilters() {
    this.filters = {
      ...this.filters,
      mostrarEliminados: this.elminadosFilter ? true : undefined,
    };

    // Remove undefined values from filters
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(
        ([_, v]) => v !== undefined && v !== '' && v !== 'undefined'
      )
    );
    console.log(this.filters);
    this.actualPage.set(1); // Reset to first page on new filter
    this.applyFiltersAndPagination();
  }

  clearFilters() {
    this.elminadosFilter = undefined;
    this.filters = {};
    this.actualPage.set(1); // Reset to first page on clear filters
    this.applyFiltersAndPagination();
  }

  async viewDetails(producto: Producto) {
    const modal = await this.modalCtrl.create({
      component: ProductoInfoPage,
      componentProps: { producto: producto },
      breakpoints: [0.5, 1],
      initialBreakpoint: 0.5,
    });
    //console.log(credito);
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    //console.log(data, role);
  }

  viewDesktopDetails(id?: number) {
    this.router.navigate(['./dashboard/productos/detalle', id]);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

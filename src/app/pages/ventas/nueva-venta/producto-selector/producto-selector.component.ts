import { Component, computed, inject, Input } from '@angular/core';
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
import { Producto, ProductosFilter } from 'src/app/interfaces/producto';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-producto-selector',
  templateUrl: './producto-selector.component.html',
  styleUrls: ['./producto-selector.component.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonList,
    IonSearchbar,
    IonLabel,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonTitle,
  ],
})
export class ProductoSelectorComponent {
  private modalCtrl = inject(ModalController);
  private productosService = inject(ProductosService);

  listadoProductos = computed(() => this.productosService.listadoProductos());

  constructor() {
    this.productosService.getProductos();
  }

  searchProducto($event: any) {
    const query = $event.target.value;
    const searchFilter: ProductosFilter = {
      searchTerm: query,
    };
    this.productosService.getProductos(0, 0, searchFilter);
  }

  select(producto: Producto) {
    return this.modalCtrl.dismiss(producto, 'confirm');
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }
}

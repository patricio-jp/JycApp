import { Component, computed, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonTitle,
  ModalController,
  IonLabel,
  IonSearchbar,
  IonList,
  IonItem,
} from '@ionic/angular/standalone';
import { Producto } from 'src/app/interfaces/producto';
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
    IonCard,
    IonCardContent,
  ],
})
export class ProductoSelectorComponent {
  private modalCtrl = inject(ModalController);
  private productosService = inject(ProductosService);

  listadoProductos = computed(() => this.productosService.listadoProductos());
  searchResults: Producto[] = [];

  constructor() {
    this.productosService.getProductos();
  }

  onSearchChange($event: any) {
    const query = $event.target.value.toLowerCase();
    this.searchResults = this.listadoProductos().filter(
      (producto) =>
        producto.codigo.toLowerCase().includes(query) ||
        producto.nombre.toLowerCase().includes(query)
    );
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

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCardSubtitle,
  IonCardHeader,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonLabel,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from 'src/app/interfaces/producto';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonCardContent,
    IonCardTitle,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class DetalleProductoPage {
  route: ActivatedRoute = inject(ActivatedRoute);
  productosService = inject(ProductosService);
  producto: Producto | undefined;

  constructor() {
    const productoID = Number(this.route.snapshot.params['id']);
    this.productosService
      .getProducto(productoID)
      .subscribe((producto) => (this.producto = producto));
  }
}

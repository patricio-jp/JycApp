import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCardHeader,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonLabel,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from 'src/app/interfaces/producto';
import { Subscription } from 'rxjs';

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
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
  ],
})
export class DetalleProductoPage implements OnDestroy {
  route: ActivatedRoute = inject(ActivatedRoute);
  productosService = inject(ProductosService);
  producto?: Producto;

  private subscriptions = new Subscription();

  constructor() {
    const productoID = Number(this.route.snapshot.params['id']);
    this.subscriptions.add(
      this.productosService
        .getProducto(productoID)
        .subscribe((producto) => (this.producto = producto))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  ModalController,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from 'src/app/interfaces/producto';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ProductoInfoPage } from '../detalle-producto/producto-info/producto-info.page';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
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
    FaIconComponent,
  ],
})
export class InventarioPage implements OnInit {
  constructor() {}

  private productsService = inject(ProductosService);

  private modalCtrl = inject(ModalController);

  private router = inject(Router);

  dataProductos = computed(() => this.productsService.dataProductos());
  listadoProductos = computed(() => this.productsService.listadoProductos());
  loadingSignal = computed(() => this.productsService.loadingSignal());

  ngOnInit() {
    this.productsService.getProductos();
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
}

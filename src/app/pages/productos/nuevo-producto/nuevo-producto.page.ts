import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ToastController } from '@ionic/angular/standalone';
import { ProductosService } from 'src/app/services/productos.service';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { CreateProductoDTO, Producto } from 'src/app/interfaces/producto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.page.html',
  styleUrls: ['./nuevo-producto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class NuevoProductoPage implements OnDestroy {
  constructor() {
    addIcons({ trashOutline });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private productsService = inject(ProductosService);
  private toastCtrl = inject(ToastController);
  private subscriptions = new Subscription();

  nuevoProducto = this.formBuilder.group({
    codigo: ['', Validators.required],
    nombre: ['', Validators.required],
    stock: [null],
    costos: this.formBuilder.array([
      this.formBuilder.group({
        fechaInicio: [new Date().toISOString(), Validators.required],
        precioUnitario: [null, [Validators.required, Validators.min(0)]],
        fechaFin: [null],
      }),
    ]),
    precios: this.formBuilder.array([
      this.formBuilder.group({
        fechaInicio: [new Date().toISOString(), Validators.required],
        precioUnitario: [null, [Validators.required, Validators.min(0)]],
        fechaFin: [null],
      }),
    ]),
  });

  get costos() {
    return this.nuevoProducto.get('costos') as FormArray;
  }

  get precios() {
    return this.nuevoProducto.get('precios') as FormArray;
  }

  addCosto() {
    this.costos.push(
      this.formBuilder.group({
        fechaInicio: [new Date().toISOString(), Validators.required],
        precioUnitario: [null, [Validators.required, Validators.min(0)]],
        fechaFin: [null],
      })
    );
  }

  addPrecio() {
    this.precios.push(
      this.formBuilder.group({
        fechaInicio: [new Date().toISOString(), Validators.required],
        precioUnitario: [null, [Validators.required, Validators.min(0)]],
        fechaFin: [null],
      })
    );
  }

  resetForm() {
    this.nuevoProducto.reset();
  }

  async guardarProducto() {
    /* console.log(this.nuevoProducto.value);
    const toast = await this.toastCtrl.create({
      position: 'top',
      duration: 3000,
      message: 'Producto creado exitosamente',
    });

    await toast.present();

    toast.onDidDismiss().then(() => {
      this.router.navigate(['./dashboard/productos/inventario']);
    }); */
    if (this.nuevoProducto.valid) {
      try {
        const producto: CreateProductoDTO = {
          ...this.nuevoProducto.value,
          codigo: this.nuevoProducto.value.codigo?.toUpperCase() || '',
          nombre: this.nuevoProducto.value.nombre || '',
          costos: this.costos.value || [],
          precios: this.precios.value || [],
          stock: this.nuevoProducto.value.stock || 0,
        };
        this.subscriptions.add(
          this.productsService
            .createProducto(producto)
            .subscribe(async (nuevoProd) => {
              const toast = await this.toastCtrl.create({
                position: 'top',
                duration: 3000,
                message: 'Producto creado exitosamente',
              });

              await toast.present();

              toast.onDidDismiss().then(() => {
                this.router.navigate(['./dashboard/productos/inventario']);
              });
            })
        );
      } catch (error) {
        const toast = await this.toastCtrl.create({
          position: 'top',
          duration: 3000,
          message: 'Error al crear el producto',
        });

        await toast.present();
      }
    } else {
      const toast = await this.toastCtrl.create({
        position: 'top',
        duration: 3000,
        message: 'Formulario inválido',
      });

      await toast.present();
    }
  }
}

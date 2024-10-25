import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  addCircleOutline,
  removeCircleOutline,
  search,
  trashOutline,
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { VentasService } from 'src/app/services/ventas.service';
import {
  CondicionOperacion,
  EstadoOperacion,
} from 'src/app/interfaces/operaciones';
import { Periodo } from 'src/app/interfaces/credito';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from 'src/app/interfaces/producto';
import { Cliente } from 'src/app/interfaces/cliente';
import { ClienteSelectorComponent } from './cliente-selector/cliente-selector.component';
import { ProductoSelectorComponent } from './producto-selector/producto-selector.component';

@Component({
  selector: 'app-nueva-venta',
  templateUrl: './nueva-venta.page.html',
  styleUrls: ['./nueva-venta.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class NuevaVentaPage {
  constructor() {
    addIcons({
      trashOutline,
      search,
      add,
      addCircleOutline,
      removeCircleOutline,
    });
  }

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private modalCtrl = inject(ModalController);

  private ventasService = inject(VentasService);
  private productosService = inject(ProductosService);

  condicionOperacion = CondicionOperacion;

  hasDiscount: boolean = false;
  hasCredito: boolean = false;
  entregado: boolean = false;

  nuevaVenta = this.formBuilder.group({
    fecha: [new Date().toISOString().substring(0, 10), Validators.required],
    cliente_id: [0, Validators.required],
    cliente: [''],
    subtotal: [0, Validators.min(0)],
    descuento: [0, Validators.min(0)],
    total: [0, [Validators.required, Validators.min(0)]],
    condicion: [CondicionOperacion.CONTADO, Validators.required],
    productos: this.formBuilder.array([
      /* this.formBuilder.group({
        producto_id: [null, Validators.required],
        cantidad: [1, [Validators.required, Validators.min(1)]],
        precioUnitario: [null, [Validators.required, Validators.min(0)]],
      }), */
    ]),
    financiacion: this.formBuilder.group({
      fechaInicio: [
        new Date().toISOString().substring(0, 10),
        Validators.required,
      ],
      anticipo: [0, Validators.min(0)],
      cantidadCuotas: [1, [Validators.required, Validators.min(1)]],
      montoCuota: [0, [Validators.required, Validators.min(0)]],
      periodo: [Periodo.Mensual, Validators.required],
    }),
    comprobante: [null],
    observaciones: [null],
    fechaEntrega: [new Date().toISOString().substring(0, 10)],
    estado: [EstadoOperacion.Pendiente],
  });

  selectedClient?: Cliente;

  get productos() {
    return this.nuevaVenta.get('productos') as FormArray<FormGroup>;
  }

  get condicion() {
    return this.nuevaVenta.get('condicion')?.value;
  }

  get subtotal() {
    return this.nuevaVenta.get('subtotal')?.value;
  }

  get total() {
    return this.nuevaVenta.get('total')?.value;
  }

  get financiacion() {
    return this.nuevaVenta.get('financiacion') as FormGroup;
  }

  get totalCredito() {
    return (
      this.financiacion.get('cantidadCuotas')?.value *
      this.financiacion.get('montoCuota')?.value
    );
  }

  async searchCliente() {
    const modalCliente = await this.modalCtrl.create({
      component: ClienteSelectorComponent,
      componentProps: { cliente: this.selectedClient },
    });
    modalCliente.present();

    const { data, role } = await modalCliente.onWillDismiss();
    if (role === 'confirm' && data) {
      this.selectedClient = data;
      this.nuevaVenta.patchValue({
        cliente_id: this.selectedClient?.id ?? null,
        cliente:
          this.selectedClient?.apellido + ', ' + this.selectedClient?.nombre,
      });
    }
    //console.log(data, role);
  }

  async agregarProducto() {
    const modalProducto = await this.modalCtrl.create({
      component: ProductoSelectorComponent,
    });
    modalProducto.present();

    const { data, role } = await modalProducto.onWillDismiss();
    //console.log(data, role);
    this.addProducto(data, 1);
  }

  addProducto(prod: Producto, cant: number, precio?: number) {
    console.log(prod);
    this.productos.push(
      this.formBuilder.group({
        producto_id: [prod.id, Validators.required],
        producto: [prod],
        cantidad: [cant, [Validators.required, Validators.min(1)]],
        precioUnitario: [
          precio ? precio : Number(prod.precios.at(-1)?.precioUnitario),
          [Validators.required, Validators.min(0)],
        ],
      })
    );
    this.nuevaVenta.controls.subtotal.patchValue(this.calculateSubtotal());
    this.refreshTotal();
  }

  addQty(id_prod: number) {
    const existingProductIndex = this.productos.controls.findIndex(
      (control) => control.get('producto_id')?.value === id_prod
    );

    if (existingProductIndex !== -1) {
      // Product exists, update the quantity
      const existingProduct = this.productos.at(existingProductIndex);
      const currentCantidad = existingProduct.get('cantidad')?.value || 0;
      existingProduct.patchValue({ cantidad: currentCantidad + 1 });
      this.nuevaVenta.controls.subtotal.patchValue(this.calculateSubtotal());
      this.refreshTotal();
    }
  }

  decreaseQty(id_prod: number) {
    const existingProductIndex = this.productos.controls.findIndex(
      (control) => control.get('producto_id')?.value === id_prod
    );

    if (existingProductIndex !== -1) {
      const existingProduct = this.productos.at(existingProductIndex);
      const currentCantidad = existingProduct.get('cantidad')?.value || 0;
      if (currentCantidad > 1) {
        existingProduct.patchValue({ cantidad: currentCantidad - 1 });
      } else {
        // Remove product if quantity is 0
        this.productos.removeAt(existingProductIndex);
      }
    }
    this.nuevaVenta.controls.subtotal.patchValue(this.calculateSubtotal());
    this.refreshTotal();
  }

  calculateSubtotal(): number {
    let subtotal = 0;
    for (let i = 0; i < this.productos.length; i++) {
      const prod = this.productos.at(i);
      subtotal +=
        prod.get('cantidad')?.value * prod.get('precioUnitario')?.value;
    }
    return subtotal;
  }

  calculateTotal(): number {
    return (
      this.calculateSubtotal() - Number(this.nuevaVenta.get('descuento')?.value)
    );
  }

  refreshTotal() {
    this.nuevaVenta.controls.total.patchValue(this.calculateTotal());
  }

  toggleDiscount() {
    this.hasDiscount = !this.hasDiscount;
    if (!this.hasDiscount) {
      this.nuevaVenta.controls.descuento.setValue(0);
      this.refreshTotal();
    }
  }

  toggleEntrega() {
    this.entregado = !this.entregado;
    if (!this.entregado) {
      this.nuevaVenta.controls.fechaEntrega.setValue(null);
    }
  }

  toggleCredito() {
    if (this.condicion === CondicionOperacion.CTA_CTE) {
      this.hasCredito = true;
    } else {
      this.hasCredito = false;
      this.resetFinanciacion();
    }
  }

  removeProducto(id_prod: number) {
    const existingProductIndex = this.productos.controls.findIndex(
      (control) => control.get('producto_id')?.value === id_prod
    );

    this.productos.removeAt(existingProductIndex);
    this.nuevaVenta.controls.subtotal.patchValue(this.calculateSubtotal());
    this.refreshTotal();
  }

  resetFinanciacion() {
    this.financiacion.reset();
  }

  clearProductos() {
    this.productos.reset();
  }

  resetVenta() {
    this.nuevaVenta.reset();
  }

  async guardarVenta() {
    console.log(this.nuevaVenta.value);
  }

  /* increaseQuantity(producto: FormGroup) {
    const currentQuantity = producto.get('cantidad')?.value || 0;
    producto.get('cantidad')?.setValue(currentQuantity + 1);
  }

  decreaseQuantity(producto: FormGroup) {
    const currentQuantity = producto.get('cantidad')?.value || 0;
    if (currentQuantity > 0) {
      producto.get('cantidad')?.setValue(currentQuantity - 1);
    }
  } */
}

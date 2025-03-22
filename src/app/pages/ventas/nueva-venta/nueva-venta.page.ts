import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  addCircleOutline,
  cloudUploadOutline,
  removeCircleOutline,
  search,
  trashOutline,
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { VentasService } from 'src/app/services/ventas.service';
import {
  CondicionOperacion,
  CreateVentaDTO,
  EstadoOperacion,
} from 'src/app/interfaces/operaciones';
import { Periodo } from 'src/app/interfaces/credito';
import { Producto } from 'src/app/interfaces/producto';
import { Cliente } from 'src/app/interfaces/cliente';
import { ClienteSelectorComponent } from './cliente-selector/cliente-selector.component';
import { ProductoSelectorComponent } from './producto-selector/producto-selector.component';
import { Subscription } from 'rxjs';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { LocalFile } from 'src/app/interfaces/files';
import { FileService } from 'src/app/services/files.service';
import { NotificationsService } from 'src/app/services/notifications.service';

const IMAGE_DIR = 'stored-comprobantes';

@Component({
  selector: 'app-nueva-venta',
  templateUrl: './nueva-venta.page.html',
  styleUrls: ['./nueva-venta.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class NuevaVentaPage implements OnDestroy {
  constructor() {
    addIcons({
      trashOutline,
      search,
      add,
      addCircleOutline,
      removeCircleOutline,
      cloudUploadOutline,
    });

    this.loadFiles();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private modalCtrl = inject(ModalController);
  private subscriptions = new Subscription();

  private ventasService = inject(VentasService);
  private filesService = inject(FileService);
  private notificationsService = inject(NotificationsService);

  condicionOperacion = CondicionOperacion;

  hasDiscount: boolean = false;
  hasCredito: boolean = true;
  entregado: boolean = false;

  images: LocalFile[] = [];

  nuevaVenta = this.formBuilder.group({
    fecha: [new Date().toISOString().substring(0, 10), Validators.required],
    cliente_id: [0, Validators.required],
    cliente: ['', Validators.required],
    subtotal: [0, Validators.min(0)],
    descuento: [0, Validators.min(0)],
    total: [0, [Validators.required, Validators.min(0)]],
    condicion: [CondicionOperacion.CTA_CTE, Validators.required],
    productos: this.formBuilder.array(
      [
        /* this.formBuilder.group({
        producto_id: [null, Validators.required],
        cantidad: [1, [Validators.required, Validators.min(1)]],
        precioUnitario: [null, [Validators.required, Validators.min(0)]],
      }), */
      ],
      Validators.required
    ),
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
    comprobante: [null, Validators.required],
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
    console.log(this.nuevaVenta.valid);
    if (this.nuevaVenta.valid) {
      const venta: CreateVentaDTO = {
        fecha: this.nuevaVenta.get('fecha')?.value ?? new Date(),
        cliente_id: Number(this.nuevaVenta.get('cliente_id')?.value) ?? 0,
        subtotal: Number(this.nuevaVenta.get('subtotal')?.value) || 0,
        descuento: Number(this.nuevaVenta.get('descuento')?.value) ?? undefined,
        total: Number(this.nuevaVenta.get('total')?.value) || 0,
        condicion:
          this.nuevaVenta.get('condicion')?.value ??
          (this.hasCredito
            ? CondicionOperacion.CTA_CTE
            : CondicionOperacion.CONTADO),
        productos: this.productos.controls.map((control) => ({
          id_producto: Number(control.get('producto_id')?.value),
          cantidad: Number(control.get('cantidad')?.value),
          precioUnitario: Number(control.get('precioUnitario')?.value) || 0,
        })),
        financiacion: this.hasCredito
          ? {
              fechaInicio: this.financiacion.get('fechaInicio')?.value,
              anticipo: Number(this.financiacion.get('anticipo')?.value),
              cantidadCuotas: Number(
                this.financiacion.get('cantidadCuotas')?.value
              ),
              montoCuota: Number(this.financiacion.get('montoCuota')?.value),
              periodo:
                Number(this.financiacion.get('periodo')?.value) ?? undefined,
            }
          : undefined,
        comprobante: this.nuevaVenta.get('comprobante')?.value ?? undefined,
        observaciones: this.nuevaVenta.get('observaciones')?.value ?? undefined,
        fechaEntrega: this.entregado
          ? this.nuevaVenta.get('fechaEntrega')?.value ?? new Date()
          : undefined,
        estado: Number(this.nuevaVenta.get('estado')?.value) ?? undefined,
      };
      //console.log(venta);
      try {
        this.subscriptions.add(
          (
            await this.ventasService.createVenta(venta, this.images[0])
          ).subscribe(async (nuevaVta) => {
            this.notificationsService.presentToast(
              'Venta cargada exitosamente'
            );
            this.nuevaVenta.reset();
            this.deleteImage(this.images[0]);
            this.ventasService.getVentas();
            this.router.navigate(['./ventas/listado']);
          })
        );
      } catch (error) {
        this.notificationsService.presentErrorToast('Error al cargar la venta');
      }
    } else {
      this.notificationsService.presentWarningToast(
        'Complete todos los campos requeridos'
      );
    }
  }

  async loadFiles() {
    this.images = [];

    Filesystem.readdir({
      path: IMAGE_DIR,
      directory: Directory.Data,
    }).then(
      (result) => {
        this.loadFileData(result.files.map((x) => x.name));
      },
      async (err) => {
        // Folder does not yet exists!
        await Filesystem.mkdir({
          path: IMAGE_DIR,
          directory: Directory.Data,
        });
      }
    );
  }

  async loadFileData(fileNames: string[]) {
    for (let f of fileNames) {
      const filePath = `${IMAGE_DIR}/${f}`;

      const readFile = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data,
      });

      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`,
      });
    }
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
    });

    if (image) {
      //console.log(image);
      this.saveImage(image);
    }
  }

  async saveImage(photo: Photo) {
    const base64Data = await this.filesService.readAsBase64(photo);

    const fileName = this.nuevaVenta.get('comprobante')?.value + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data,
      directory: Directory.Data,
    });
    this.loadFiles();
    //console.log(this.images);
  }

  async deleteImage(file: LocalFile) {
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: file.path,
    });
    this.loadFiles();
  }
}

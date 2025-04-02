import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  ActionSheetButton,
  ActionSheetController,
  ModalController,
} from '@ionic/angular/standalone';
import { QrCodeModule } from 'ng-qrcode';
import { Subscription } from 'rxjs';
import { FormaPago, Recibo } from 'src/app/interfaces/ingreso';
import { IngresosService } from 'src/app/services/ingresos.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-ver-recibo',
  templateUrl: './ver-recibo.component.html',
  styleUrls: ['./ver-recibo.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    CommonModule,
    QrCodeModule,
    FaIconComponent,
  ],
})
export class VerReciboComponent implements OnDestroy {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private ingresosService = inject(IngresosService);
  private actionSheetCtrl = inject(ActionSheetController);
  private modalCtrl = inject(ModalController);
  private notificationsService = inject(NotificationsService);

  private subscriptions = new Subscription();

  @Input() recibo?: Recibo;
  formasPago = FormaPago;

  isValidationPage: boolean = true;

  qrCodeURL = computed(
    () =>
      `https://jyc-amoblamientos.duckdns.org/validarPago?uuid=${this.recibo?.uuid}`
  );

  constructor() {
    if (!this.router.url.includes('/validarPago')) {
      this.isValidationPage = false;
    } else {
      const uuid = this.route.snapshot.queryParams['uuid'];
      console.log(uuid);
      this.subscriptions.add(
        this.ingresosService.getReciboByUUID(uuid).subscribe((data) => {
          this.recibo = data;
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  printRecibo() {
    const reciboInfo = document.getElementById('recibo');
    if (!reciboInfo) return;

    const qrContainer = document.getElementById('qrContainer');
    if (!qrContainer) return;
    const canvas = qrContainer.getElementsByTagName('canvas')[0];
    if (!canvas) return;

    const imgQR = canvas.toDataURL('image/png');
    qrContainer.innerHTML = '';
    const imageElement = document.createElement('img');
    imageElement.src = imgQR ? imgQR : '';
    qrContainer.appendChild(imageElement);

    // Obtener el nombre dinámico del archivo CSS de Angular
    const styles = Array.from(document.head.getElementsByTagName('link'))
      .filter(
        (link) => link.rel === 'stylesheet' && link.href.includes('styles')
      )
      .map((link) => `<link rel="stylesheet" href="${link.href}">`)
      .join('');

    const popup = window.open('', '_blank', 'width=800, height=600');
    if (popup) {
      popup.document.open();
      popup.document.write(`
        <html class="hydrated">
          <head>
            <title>Recibo - ${this.recibo?.uuid}</title>
            ${styles}
          </head>
          <body class="max-w-[148mm] h-[210mm] mx-auto bg-white relative flex flex-col" onload="window.print();window.close()">
            ${reciboInfo.innerHTML}
          </body>
        </html>
      `);
      popup.document.close();
      qrContainer.innerHTML = '';
      qrContainer.appendChild(canvas);
    }
  }

  async sendViaWhatsapp() {
    if (!this.recibo) return;
    if (this.recibo.cliente.telefonos!.length === 0) {
      this.notificationsService.presentWarningToast(
        'El cliente no tiene teléfonos al que enviarle el recibo.'
      );
      return;
    }
    if (this.recibo.cliente.telefonos!.length > 1) {
      const buttons: ActionSheetButton[] = [];
      this.recibo?.cliente.telefonos?.forEach((telefono) => {
        if (telefono && telefono.telefono) {
          const parsedTel = `+549${telefono.telefono}`;
          const button = {
            text: `${parsedTel}`,
            role: 'selected',
            data: {
              number: `${parsedTel}`,
            },
          };
          buttons.push(button);
        }
      });

      const sheet = await this.actionSheetCtrl.create({
        header: `Seleccione el número al que desea enviar el mensaje`,
        buttons: buttons,
      });

      await sheet.present();

      const { data, role } = await sheet.onWillDismiss();

      if (role === 'selected' && data.number) {
        const url = `https://jyc-amoblamientos.duckdns.org/verificarPago?uuid=${this.recibo?.uuid}`;
        const message =
          encodeURI(
            `Hola ${this.recibo?.cliente.nombre} ${
              this.recibo?.cliente.apellido
            }. Su pago de $${Number(
              this.recibo?.ingreso.importe
            ).toLocaleString('es-AR', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
              useGrouping: true,
            })} fue cargado exitosamente.`
          ) +
          `%0D%0A` +
          encodeURI(
            `Puede visualizar el recibo dígital en esta página: ${url}`
          );

        const telefono = data.number;

        window.open(`https://wa.me/${telefono}?text=${message}`, '_blank');
      }
    } else {
      // Provisory. To improve later
      const url = `https://jyc-amoblamientos.duckdns.org/verificarPago?uuid=${this.recibo?.uuid}`;
      const message =
        encodeURI(
          `Hola ${this.recibo?.cliente.nombre} ${
            this.recibo?.cliente.apellido
          }. Su pago de $${Number(this.recibo?.ingreso.importe).toLocaleString(
            'es-AR',
            {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
              useGrouping: true,
            }
          )} fue cargado exitosamente.`
        ) +
        `%0D%0A` +
        encodeURI(`Puede visualizar el recibo dígital en esta página: ${url}`);

      const telefono = this.recibo?.cliente.telefonos?.at(0)?.telefono;
      const parsedTel = `+549${telefono}`;

      window.open(`https://wa.me/${parsedTel}?text=${message}`, '_blank');
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}

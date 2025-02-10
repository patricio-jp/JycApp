import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
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
import { Subscription } from 'rxjs';
import {
  CartonesFilter,
  EstadoCarton,
  GrupoCartones,
} from 'src/app/interfaces/carton';
import { Credito, Periodo } from 'src/app/interfaces/credito';
import { CartonesService } from 'src/app/services/cartones.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-grupo-carton',
  templateUrl: './grupo-carton.component.html',
  styleUrls: ['./grupo-carton.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FaIconComponent,
    IonItem,
    IonList,
    IonSearchbar,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonTitle,
  ],
})
export class GrupoCartonComponent implements OnInit, OnDestroy {
  @Input() credito?: Credito;
  @Input() action!: 'mostrarGrupo' | 'asignarAGrupo';

  get carton() {
    return this.credito!.carton;
  }

  get grupoCarton() {
    return this.credito!.carton.grupoCartones;
  }

  private formBuilder = inject(FormBuilder);
  private modalCtrl = inject(ModalController);
  private notificationsService = inject(NotificationsService);
  private cartonesService = inject(CartonesService);

  private subscriptions = new Subscription();

  idCarton!: number;
  idGrupo!: number;
  grupoSeleccionado!: GrupoCartones;

  periodos = Periodo;
  estadosCartones = EstadoCarton;
  filter: CartonesFilter = {};
  searchResults = computed(() => this.cartonesService.listadoGrupoCartones());

  crearNuevo: boolean = false;
  grupoCreado: boolean = false;
  nuevoGrupo = this.formBuilder.group({
    alias: [''],
  });

  title = computed(() =>
    this.action === 'asignarAGrupo'
      ? 'Asignar cartón a grupo'
      : 'Detalles del grupo de cartones'
  );

  constructor() {}

  ngOnInit() {
    this.idCarton = this.carton.id;
    if (this.action === 'mostrarGrupo' && this.grupoCarton) {
      this.grupoSeleccionado = this.grupoCarton;
    }
  }

  searchGrupo(event: any) {
    this.filter.searchTerm = event.target.value;
    this.cartonesService.getGruposCartones(0, 0, this.filter);
  }

  selectGrupo(grupo: GrupoCartones) {
    this.grupoSeleccionado = grupo;
    this.idGrupo = grupo.id;
  }

  crearGrupo() {
    const nuevoGrupo = {
      alias: this.nuevoGrupo.get('alias')?.value || undefined,
    };
    this.subscriptions.add(
      this.cartonesService
        .createGrupoCartones(nuevoGrupo)
        .subscribe((grupo) => {
          this.grupoCreado = true;
          this.crearNuevo = false;
          this.selectGrupo(grupo);
        })
    );
  }

  cancel() {
    return this.modalCtrl.dismiss(undefined, 'cancel');
  }

  confirm() {
    //console.log(this.estadoNuevo);
    if (this.idCarton && this.idGrupo) {
      return this.modalCtrl.dismiss(
        { idCarton: this.idCarton, idGrupo: this.idGrupo },
        'confirm'
      );
    } else {
      this.notificationsService.presentWarningToast(
        'No se hicieron cambios. Cancelando'
      );
      return this.modalCtrl.dismiss();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

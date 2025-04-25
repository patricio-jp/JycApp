import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPopover,
  ModalController,
  ActionSheetController,
  ActionSheetButton,
} from '@ionic/angular/standalone';

import { Router, RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import {
  EstadoUsuario,
  Rol,
  Usuario,
  UsuariosFilter,
} from 'src/app/interfaces/usuario';
import { RestorePasswordComponent } from '../restore-password/restore-password.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.page.html',
  styleUrls: ['./listado-usuarios.page.scss'],
  standalone: true,
  imports: [
    IonPopover,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    FaIconComponent,
    CommonModule,
    RouterModule,
    FormsModule,
  ],
})
export class ListadoUsuariosPage implements OnInit, OnDestroy {
  constructor() {}

  private usuariosService = inject(UsuariosService);
  private notificationsService = inject(NotificationsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private subscriptions = new Subscription();

  private modalCtrl = inject(ModalController);
  private actionSheetCtrl = inject(ActionSheetController);

  dataUsuarios = computed(() => this.usuariosService.dataUsuarios());
  listadoUsuarios = computed(() => this.usuariosService.listadoUsuarios());

  loggedUser = computed(() => this.authService.user());
  isAdmin = computed(() => {
    const user = this.loggedUser();
    return user && user.rol === Rol.Administrador;
  });

  rolesUsuarios = Rol;
  estadosUsuarios = EstadoUsuario;

  actualPage = signal(1);
  pageSize: number = 10;
  totalPages = computed(() => {
    const totalVentas = this.dataUsuarios().count;
    return Math.ceil(totalVentas / this.pageSize);
  });
  arrayPages = computed(() => {
    const range = window.matchMedia('(max-width: 768px)').matches ? 1 : 3;
    const totalPages = this.totalPages();
    const currentPage = this.actualPage();

    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);

    const pages = [];

    if (start > 1) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      pages.push('...');
    }

    return pages;
  });
  itemsShowed = computed(() => {
    const start = (this.actualPage() - 1) * this.pageSize + 1;
    const end = Math.min(
      this.actualPage() * this.pageSize,
      this.dataUsuarios().count
    );
    return `${start} - ${end}`;
  });

  searchTerm?: string;
  domicilioFilter?: string;
  rolFilter?: Rol;
  elminadosFilter?: boolean;

  filters: UsuariosFilter = {};

  ngOnInit() {
    this.usuariosService.getUsuarios(10, 1);
  }

  applyFiltersAndPagination() {
    this.usuariosService.getUsuarios(
      this.pageSize,
      this.actualPage(),
      this.filters
    );
  }

  searchUsuarios(event: any) {
    this.filters.searchTerm = event.target.value;
    this.applyFilters();
  }

  nextPage() {
    if (this.actualPage() < this.totalPages()) {
      this.actualPage.set(this.actualPage() + 1);
      this.applyFiltersAndPagination();
    }
  }

  previousPage() {
    if (this.actualPage() > 1) {
      this.actualPage.set(this.actualPage() - 1);
      this.applyFiltersAndPagination();
    }
  }

  goToPage(page: number) {
    if (this.actualPage() !== page) {
      this.actualPage.set(page);
      this.applyFiltersAndPagination();
    }
  }

  applyFilters() {
    this.filters = {
      ...this.filters,
      domicilio: this.domicilioFilter,
      rol: this.rolFilter,
      mostrarEliminados: this.elminadosFilter ? true : undefined,
    };

    // Remove undefined values from filters
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(
        ([_, v]) => v !== undefined && v !== '' && v !== 'undefined'
      )
    );
    console.log(this.filters);
    this.actualPage.set(1); // Reset to first page on new filter
    this.applyFiltersAndPagination();
  }

  clearFilters() {
    this.domicilioFilter = undefined;
    this.rolFilter = undefined;
    this.elminadosFilter = undefined;
    this.filters = {};
    this.actualPage.set(1); // Reset to first page on clear filters
    this.applyFiltersAndPagination();
  }

  usuarioDesktopDetails(id?: number) {
    this.notificationsService.presentToast('Función no implementada aún');
    //this.router.navigate(['./dashboard/usuarios/detalle/', id]);
  }

  async usuarioDetails(id?: number) {
    this.notificationsService.presentToast('Función no implementada aún');
    /* const modal = await this.modalCtrl.create({
        component: ClienteInfoComponent,
        componentProps: { usuarioID: id },
        breakpoints: [0.5, 1],
        initialBreakpoint: 0.5,
      });

      modal.present();

      const { data, role } = await modal.onWillDismiss(); */
  }

  async restorePassword(usuario: Usuario, _selfRestore: boolean = false) {
    if (!usuario) return;
    if (this.loggedUser() && this.loggedUser()?.id === usuario.id) {
      _selfRestore = true;
    }

    const modal = await this.modalCtrl.create({
      component: RestorePasswordComponent,
      componentProps: { usuario: usuario, isSelfRestore: _selfRestore },
      breakpoints: [0.5, 1],
      initialBreakpoint: 0.5,
    });

    modal.present();
  }

  async deleteUsuario(usuario: Usuario) {
    const buttons: ActionSheetButton[] = [
      this.loggedUser()?.id !== usuario.id
        ? {
            text: 'Si, eliminar',
            role: 'destructive',
            data: {
              action: 'soft-delete',
            },
          }
        : {},
      this.isAdmin() && this.loggedUser()?.id !== usuario.id
        ? {
            text: 'Si, eliminar definitivamente',
            role: 'destructive',
            data: {
              action: 'delete',
            },
          }
        : {},
      {
        text: 'No, cancelar',
        role: 'cancel',
        data: {
          action: 'cancel',
        },
      },
    ];
    const sheet = await this.actionSheetCtrl.create({
      header: `Seguro desea eliminar el usuario ${usuario.apellido}, ${usuario.nombre}?`,
      buttons: buttons.filter((button) => Object.keys(button).length > 0),
    });

    await sheet.present();

    const { data, role } = await sheet.onWillDismiss();
    console.log('data: ', data);
    console.log('role: ', role);
    if (role === 'destructive' && data.action && usuario.id) {
      if (data.action === 'soft-delete') {
        this.subscriptions.add(
          this.usuariosService
            .deleteUsuario(usuario.id)
            .subscribe(async (usuario) => {
              if (usuario) {
                this.notificationsService.presentSuccessToast(
                  'Usuario eliminado correctamente'
                );
                this.usuariosService.getUsuarios();
              }
            })
        );
      } else if (data.action === 'delete') {
        this.subscriptions.add(
          this.usuariosService
            .forceDeleteUsuario(usuario.id)
            .subscribe(async (usuario) => {
              if (usuario) {
                this.notificationsService.presentSuccessToast(
                  'Usuario eliminado definitivamente'
                );
                this.usuariosService.getUsuarios();
              }
            })
        );
      }
    }
  }

  async restoreUsuario(usuario: Usuario) {
    const sheet = await this.actionSheetCtrl.create({
      header: `Restablecer el usuario ${usuario.apellido}, ${usuario.nombre}?`,
      mode: 'ios',
      buttons: [
        {
          text: 'No',
          role: 'destructive',
          data: {
            action: 'cancel',
          },
        },
        {
          text: 'Si, restablecer',
          role: 'selected',
          data: {
            action: 'restore',
          },
        },
      ],
    });

    await sheet.present();

    const { data, role } = await sheet.onWillDismiss();
    console.log('data: ', data);
    console.log('role: ', role);
    if (role === 'selected' && data.action && usuario.id) {
      if (data.action === 'restore') {
        this.subscriptions.add(
          this.usuariosService
            .restoreUsuario(usuario.id)
            .subscribe(async (usuario) => {
              if (usuario) {
                this.notificationsService.presentSuccessToast(
                  'Usuario restablecido correctamente'
                );
                this.usuariosService.getUsuarios();
              }
            })
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-usuarios-dashboard',
  templateUrl: './usuarios-dashboard.page.html',
  styleUrls: ['./usuarios-dashboard.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class UsuariosDashboardPage implements OnInit {
  private usuariosService = inject(UsuariosService);

  cantUsuarios = computed(() => this.usuariosService.cantUsuariosTotales());
  cantUsuariosAdmin = computed(() => this.usuariosService.cantUsuariosAdmin());
  cantUsuariosSupervisores = computed(() =>
    this.usuariosService.cantUsuariosSupervisores()
  );
  cantUsuariosCobradores = computed(() =>
    this.usuariosService.cantUsuariosCobradores()
  );
  cantUsuariosVendedores = computed(() =>
    this.usuariosService.cantUsuariosVendedores()
  );

  cantUsuariosActivos = computed(() =>
    this.usuariosService.cantUsuariosActivos()
  );
  cantUsuariosDeshabilitados = computed(() =>
    this.usuariosService.cantUsuariosDeshabilitados()
  );

  constructor() {}

  ngOnInit() {
    this.usuariosService.getCounters();
  }
}

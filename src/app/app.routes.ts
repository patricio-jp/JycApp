import { Routes } from '@angular/router';
import { AuthGuardService, LoginGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { Rol } from './interfaces/usuario';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
    canActivate: [LoginGuard],
    title: 'Iniciar Sesión - JyC Amoblamientos',
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
        title: 'Inicio - JyC Amoblamientos',
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./pages/clientes/clientes.page').then((m) => m.ClientesPage),
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import(
                './pages/clientes/clientes-dashboard/clientes-dashboard.page'
              ).then((m) => m.ClientesDashboardPage),
            title: 'Clientes - JyC Amoblamientos',
          },
          {
            path: 'listado',
            loadComponent: () =>
              import(
                './pages/clientes/listado-clientes/listado-clientes.page'
              ).then((m) => m.ListadoClientesPage),
            title: 'Listado de clientes - JyC Amoblamientos',
          },
          {
            path: 'nuevo',
            loadComponent: () =>
              import('./pages/clientes/nuevo-cliente/nuevo-cliente.page').then(
                (m) => m.NuevoClientePage
              ),
            title: 'Nuevo cliente - JyC Amoblamientos',
            canActivate: [roleGuard],
            data: { roles: [Rol.Administrador, Rol.Supervisor, Rol.Vendedor] },
          },
          {
            path: 'detalle/:id',
            loadComponent: () =>
              import(
                './pages/clientes/detalle-cliente/detalle-cliente.page'
              ).then((m) => m.DetalleClientePage),
            title: 'Detalle de cliente - JyC Amoblamientos',
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: '/clientes/dashboard',
          },
        ],
      },
      {
        path: 'creditos',
        loadComponent: () =>
          import('./pages/creditos/creditos.page').then((m) => m.CreditosPage),
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import(
                './pages/creditos/creditos-dashboard/creditos-dashboard.page'
              ).then((m) => m.CreditosDashboardPage),
            title: 'Créditos - JyC Amoblamientos',
            canActivate: [roleGuard],
            data: { roles: [Rol.Administrador, Rol.Supervisor, Rol.Cobrador] },
          },
          {
            path: 'listado',
            loadComponent: () =>
              import(
                './pages/creditos/listado-creditos/listado-creditos.page'
              ).then((m) => m.ListadoCreditosPage),
            title: 'Listado de créditos - JyC Amoblamientos',
            canActivate: [roleGuard],
            data: { roles: [Rol.Administrador, Rol.Supervisor, Rol.Cobrador] },
          },
          {
            path: 'cargar-pago',
            loadComponent: () =>
              import('./pages/creditos/cargar-pago/cargar-pago.page').then(
                (m) => m.CargarPagoPage
              ),
            title: 'Cargar Pago - JyC Amoblamientos',
            canActivate: [roleGuard],
            data: { roles: [Rol.Administrador, Rol.Supervisor, Rol.Cobrador] },
          },
          {
            path: 'detalle/:id',
            loadComponent: () =>
              import(
                './pages/creditos/detalle-credito/detalle-credito.page'
              ).then((m) => m.DetalleCreditoPage),
            title: 'Detalle de crédito - JyC Amoblamientos',
            canActivate: [roleGuard],
            data: { roles: [Rol.Administrador, Rol.Supervisor, Rol.Cobrador] },
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: '/creditos/dashboard',
          },
        ],
      },
      {
        path: 'ventas',
        loadComponent: () =>
          import('./pages/ventas/ventas.page').then((m) => m.VentasPage),
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import(
                './pages/ventas/ventas-dashboard/ventas-dashboard.page'
              ).then((m) => m.VentasDashboardPage),
            title: 'Ventas - JyC Amoblamientos',
            canActivate: [roleGuard],
            data: { roles: [Rol.Administrador, Rol.Supervisor, Rol.Vendedor] },
          },
          {
            path: 'listado',
            loadComponent: () =>
              import('./pages/ventas/listado-ventas/listado-ventas.page').then(
                (m) => m.ListadoVentasPage
              ),
            title: 'Listado de ventas - JyC Amoblamientos',
            canActivate: [roleGuard],
            data: { roles: [Rol.Administrador, Rol.Supervisor, Rol.Vendedor] },
          },
          {
            path: 'nueva',
            loadComponent: () =>
              import('./pages/ventas/nueva-venta/nueva-venta.page').then(
                (m) => m.NuevaVentaPage
              ),
            title: 'Nueva venta - JyC Amoblamientos',
            canActivate: [roleGuard],
            data: { roles: [Rol.Administrador, Rol.Supervisor, Rol.Vendedor] },
          },
          {
            path: 'detalle/:id',
            loadComponent: () =>
              import('./pages/ventas/detalle-venta/detalle-venta.page').then(
                (m) => m.DetalleVentaPage
              ),
            title: 'Detalle de venta - JyC Amoblamientos',
            canActivate: [roleGuard],
            data: { roles: [Rol.Administrador, Rol.Supervisor, Rol.Vendedor] },
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: '/ventas/dashboard',
          },
        ],
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./pages/productos/productos.page').then(
            (m) => m.ProductosPage
          ),
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import(
                './pages/productos/productos-dashboard/productos-dashboard.page'
              ).then((m) => m.ProductosDashboardPage),
            title: 'Productos - JyC Amoblamientos',
            canActivate: [roleGuard],
            data: { roles: [Rol.Administrador, Rol.Supervisor] },
          },
          {
            path: 'inventario',
            loadComponent: () =>
              import('./pages/productos/inventario/inventario.page').then(
                (m) => m.InventarioPage
              ),
            title: 'Inventario - JyC Amoblamientos',
            canActivate: [roleGuard],
            data: { roles: [Rol.Administrador, Rol.Supervisor] },
          },
          {
            path: 'nuevo',
            loadComponent: () =>
              import(
                './pages/productos/nuevo-producto/nuevo-producto.page'
              ).then((m) => m.NuevoProductoPage),
            title: 'Nuevo producto - JyC Amoblamientos',
            canActivate: [roleGuard],
            data: { roles: [Rol.Administrador, Rol.Supervisor] },
          },
          {
            path: 'detalle/:id',
            loadComponent: () =>
              import(
                './pages/productos/detalle-producto/detalle-producto.page'
              ).then((m) => m.DetalleProductoPage),
            title: 'Detalle de producto - JyC Amoblamientos',
            canActivate: [roleGuard],
            data: { roles: [Rol.Administrador, Rol.Supervisor] },
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: '/productos/dashboard',
          },
        ],
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/usuarios/usuarios.page').then((m) => m.UsuariosPage),
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import(
                './pages/usuarios/usuarios-dashboard/usuarios-dashboard.page'
              ).then((m) => m.UsuariosDashboardPage),
            title: 'Usuarios - JyC Amoblamientos',
            canActivate: [roleGuard],
            data: { roles: [Rol.Administrador, Rol.Supervisor] },
          },
          {
            path: 'listado',
            loadComponent: () =>
              import(
                './pages/usuarios/listado-usuarios/listado-usuarios.page'
              ).then((m) => m.ListadoUsuariosPage),
            title: 'Listado de usuarios - JyC Amoblamientos',
            canActivate: [roleGuard],
            data: { roles: [Rol.Administrador, Rol.Supervisor] },
          },
          {
            path: 'nuevo',
            loadComponent: () =>
              import('./pages/usuarios/nuevo-usuario/nuevo-usuario.page').then(
                (m) => m.NuevoUsuarioPage
              ),
            title: 'Nuevo usuario - JyC Amoblamientos',
            canActivate: [roleGuard],
            data: { roles: [Rol.Administrador, Rol.Supervisor] },
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: '/usuarios/dashboard',
          },
        ],
      },
      {
        path: 'ingresos',
        loadComponent: () =>
          import('./pages/ingresos/ingresos.page').then((m) => m.IngresosPage),
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import(
                './pages/ingresos/ingresos-dashboard/ingresos-dashboard.page'
              ).then((m) => m.IngresosDashboardPage),
            title: 'Ingresos - JyC Amoblamientos',
          },
          {
            path: 'listado',
            loadComponent: () =>
              import(
                './pages/ingresos/listado-ingresos/listado-ingresos.page'
              ).then((m) => m.ListadoIngresosPage),
            title: 'Listado de ingresos - JyC Amoblamientos',
          },
          {
            path: 'nuevo',
            loadComponent: () =>
              import('./pages/ingresos/nuevo-ingreso/nuevo-ingreso.page').then(
                (m) => m.NuevoIngresoPage
              ),
            title: 'Nuevo ingreso - JyC Amoblamientos',
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: '/ingresos/dashboard',
          },
        ],
        canActivate: [roleGuard],
        data: { roles: [Rol.Administrador, Rol.Supervisor] },
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./pages/reportes/reportes.page').then((m) => m.ReportesPage),
        children: [
          {
            path: 'planilla-mensual',
            loadComponent: () =>
              import(
                './pages/reportes/planilla-mensual/planilla-mensual.page'
              ).then((m) => m.PlanillaMensualPage),
            title: 'Planilla Mensual - JyC Amoblamientos',
          },
          {
            path: 'planilla-semanal',
            loadComponent: () =>
              import(
                './pages/reportes/planilla-semanal/planilla-semanal.page'
              ).then((m) => m.PlanillaSemanalPage),
            title: 'Planilla Semanal - JyC Amoblamientos',
          },
        ],
      },
    ],
    canActivate: [AuthGuardService],
  },
  {
    path: 'validarPago',
    title: 'Validar Pago - JyC Amoblamientos',
    loadComponent: () =>
      import('./pages/ingresos/validar-pago/validar-pago.component').then(
        (m) => m.ValidarPagoComponent
      ),
  },
];

import { Routes } from '@angular/router';
import { AuthGuardService, LoginGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
    canActivate: [LoginGuard],
    title: 'Iniciar Sesión - JyC Amoblamientos',
  },
  {
    path: 'dashboard',
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
            path: '',
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
          },
          {
            path: 'detalle/:id',
            loadComponent: () =>
              import(
                './pages/clientes/detalle-cliente/detalle-cliente.page'
              ).then((m) => m.DetalleClientePage),
            title: 'Detalle de cliente - JyC Amoblamientos',
          },
        ],
      },
      {
        path: 'creditos',
        loadComponent: () =>
          import('./pages/creditos/creditos.page').then((m) => m.CreditosPage),
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './pages/creditos/creditos-dashboard/creditos-dashboard.page'
              ).then((m) => m.CreditosDashboardPage),
            title: 'Créditos - JyC Amoblamientos',
          },
          {
            path: 'listado',
            loadComponent: () =>
              import(
                './pages/creditos/listado-creditos/listado-creditos.page'
              ).then((m) => m.ListadoCreditosPage),
            title: 'Listado de créditos - JyC Amoblamientos',
          },
          {
            path: 'cargar-pago',
            loadComponent: () =>
              import('./pages/creditos/cargar-pago/cargar-pago.page').then(
                (m) => m.CargarPagoPage
              ),
            title: 'Cargar Pago - JyC Amoblamientos',
          },
          {
            path: 'detalle/:id',
            loadComponent: () =>
              import(
                './pages/creditos/detalle-credito/detalle-credito.page'
              ).then((m) => m.DetalleCreditoPage),
            title: 'Detalle de crédito - JyC Amoblamientos',
          },
        ],
      },
      {
        path: 'ventas',
        loadComponent: () =>
          import('./pages/ventas/ventas.page').then((m) => m.VentasPage),
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './pages/ventas/ventas-dashboard/ventas-dashboard.page'
              ).then((m) => m.VentasDashboardPage),
            title: 'Ventas - JyC Amoblamientos',
          },
          {
            path: 'listado',
            loadComponent: () =>
              import('./pages/ventas/listado-ventas/listado-ventas.page').then(
                (m) => m.ListadoVentasPage
              ),
            title: 'Listado de ventas - JyC Amoblamientos',
          },
          {
            path: 'nueva',
            loadComponent: () =>
              import('./pages/ventas/nueva-venta/nueva-venta.page').then(
                (m) => m.NuevaVentaPage
              ),
            title: 'Nueva venta - JyC Amoblamientos',
          },
          {
            path: 'detalle/:id',
            loadComponent: () =>
              import('./pages/ventas/detalle-venta/detalle-venta.page').then(
                (m) => m.DetalleVentaPage
              ),
            title: 'Detalle de venta - JyC Amoblamientos',
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
            path: '',
            loadComponent: () =>
              import(
                './pages/productos/productos-dashboard/productos-dashboard.page'
              ).then((m) => m.ProductosDashboardPage),
            title: 'Productos - JyC Amoblamientos',
          },
          {
            path: 'inventario',
            loadComponent: () =>
              import('./pages/productos/inventario/inventario.page').then(
                (m) => m.InventarioPage
              ),
            title: 'Inventario - JyC Amoblamientos',
          },
          {
            path: 'nuevo',
            loadComponent: () =>
              import(
                './pages/productos/nuevo-producto/nuevo-producto.page'
              ).then((m) => m.NuevoProductoPage),
            title: 'Nuevo producto - JyC Amoblamientos',
          },
          {
            path: 'detalle/:id',
            loadComponent: () =>
              import(
                './pages/productos/detalle-producto/detalle-producto.page'
              ).then((m) => m.DetalleProductoPage),
            title: 'Detalle de producto - JyC Amoblamientos',
          },
        ],
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/usuarios/usuarios.page').then((m) => m.UsuariosPage),
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './pages/usuarios/usuarios-dashboard/usuarios-dashboard.page'
              ).then((m) => m.UsuariosDashboardPage),
            title: 'Usuarios - JyC Amoblamientos',
          },
          {
            path: 'listado',
            loadComponent: () =>
              import(
                './pages/usuarios/listado-usuarios/listado-usuarios.page'
              ).then((m) => m.ListadoUsuariosPage),
            title: 'Listado de usuarios - JyC Amoblamientos',
          },
          {
            path: 'nuevo',
            loadComponent: () =>
              import('./pages/usuarios/nuevo-usuario/nuevo-usuario.page').then(
                (m) => m.NuevoUsuarioPage
              ),
            title: 'Nuevo usuario - JyC Amoblamientos',
          },
        ],
      },
    ],
    canActivate: [AuthGuardService],
  },
];

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
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./pages/clientes/clientes.page').then((m) => m.ClientesPage),
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
          {
            path: 'dashboard',
            loadComponent: () =>
              import(
                './pages/clientes/clientes-dashboard/clientes-dashboard.page'
              ).then((m) => m.ClientesDashboardPage),
          },
          {
            path: 'listado',
            loadComponent: () =>
              import(
                './pages/clientes/listado-clientes/listado-clientes.page'
              ).then((m) => m.ListadoClientesPage),
          },
          {
            path: 'nuevo',
            loadComponent: () =>
              import('./pages/clientes/nuevo-cliente/nuevo-cliente.page').then(
                (m) => m.NuevoClientePage
              ),
          },
          {
            path: 'detalle/:id',
            loadComponent: () =>
              import(
                './pages/clientes/detalle-cliente/detalle-cliente.page'
              ).then((m) => m.DetalleClientePage),
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
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
          {
            path: 'dashboard',
            loadComponent: () =>
              import(
                './pages/creditos/creditos-dashboard/creditos-dashboard.page'
              ).then((m) => m.CreditosDashboardPage),
          },
          {
            path: 'listado',
            loadComponent: () =>
              import(
                './pages/creditos/listado-creditos/listado-creditos.page'
              ).then((m) => m.ListadoCreditosPage),
          },
          {
            path: 'cargar-pago',
            loadComponent: () =>
              import('./pages/creditos/cargar-pago/cargar-pago.page').then(
                (m) => m.CargarPagoPage
              ),
          },
          {
            path: 'detalle/:id',
            loadComponent: () =>
              import(
                './pages/creditos/detalle-credito/detalle-credito.page'
              ).then((m) => m.DetalleCreditoPage),
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
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
          {
            path: 'dashboard',
            loadComponent: () =>
              import(
                './pages/ventas/ventas-dashboard/ventas-dashboard.page'
              ).then((m) => m.VentasDashboardPage),
          },
          {
            path: 'listado',
            loadComponent: () =>
              import('./pages/ventas/listado-ventas/listado-ventas.page').then(
                (m) => m.ListadoVentasPage
              ),
          },
          {
            path: 'nueva',
            loadComponent: () =>
              import('./pages/ventas/nueva-venta/nueva-venta.page').then(
                (m) => m.NuevaVentaPage
              ),
          },
          {
            path: 'detalle/:id',
            loadComponent: () =>
              import('./pages/ventas/detalle-venta/detalle-venta.page').then(
                (m) => m.DetalleVentaPage
              ),
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
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
          {
            path: 'dashboard',
            loadComponent: () =>
              import(
                './pages/productos/productos-dashboard/productos-dashboard.page'
              ).then((m) => m.ProductosDashboardPage),
          },
          {
            path: 'inventario',
            loadComponent: () =>
              import('./pages/productos/inventario/inventario.page').then(
                (m) => m.InventarioPage
              ),
          },
          {
            path: 'nuevo',
            loadComponent: () =>
              import(
                './pages/productos/nuevo-producto/nuevo-producto.page'
              ).then((m) => m.NuevoProductoPage),
          },
          {
            path: 'detalle/:id',
            loadComponent: () =>
              import(
                './pages/productos/detalle-producto/detalle-producto.page'
              ).then((m) => m.DetalleProductoPage),
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
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
          {
            path: 'dashboard',
            loadComponent: () =>
              import(
                './pages/usuarios/usuarios-dashboard/usuarios-dashboard.page'
              ).then((m) => m.UsuariosDashboardPage),
          },
          {
            path: 'listado',
            loadComponent: () =>
              import(
                './pages/usuarios/listado-usuarios/listado-usuarios.page'
              ).then((m) => m.ListadoUsuariosPage),
          },
          {
            path: 'nuevo',
            loadComponent: () =>
              import('./pages/usuarios/nuevo-usuario/nuevo-usuario.page').then(
                (m) => m.NuevoUsuarioPage
              ),
          },
        ],
      },
    ],
    canActivate: [AuthGuardService],
  },
];

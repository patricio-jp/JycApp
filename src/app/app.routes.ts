import { Routes } from '@angular/router';

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
        ],
      },
    ],
  },
];

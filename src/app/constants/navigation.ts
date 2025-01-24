import { NavLink } from '../interfaces/navLinks';

export const navLinks: NavLink[] = [
  {
    title: 'Inicio',
    url: '/dashboard',
    icon_md: 'home',
    icon_ios: 'home-outline',
  },
  {
    title: 'Clientes',
    url: '/dashboard/clientes',
    icon_md: 'people',
    icon_ios: 'people-outline',
  },
  {
    title: 'Ventas',
    url: '/dashboard/ventas',
    icon_md: 'cash',
    icon_ios: 'cash-outline',
  },
  {
    title: 'Créditos',
    url: '/dashboard/creditos',
    icon_md: 'pricetags',
    icon_ios: 'pricetags-outline',
  },
  {
    title: 'Productos',
    url: '/dashboard/productos',
    icon_md: 'cube',
    icon_ios: 'cube-outline',
  },
  {
    title: 'Usuarios',
    url: '/dashboard/usuarios',
    icon_md: 'hammer',
    icon_ios: 'hammer-outline',
  },
];

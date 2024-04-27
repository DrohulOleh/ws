import { INavData } from '@coreui/angular';

export const adminNavItems: INavData[] = [
  {
    name: 'Overview',
    url: '/overview',
    iconComponent: { name: 'cil-chart-line' },
  },
  {
    name: 'Products',
    url: '/product',
    iconComponent: { name: 'cil-fastfood' },
  },
  {
    name: 'Orders',
    url: '/order',
    iconComponent: { name: 'cil-description' },
  },
  {
    name: 'Users',
    url: '/users',
    iconComponent: { name: 'cil-user' },
  },
];

export const userNavItems: INavData[] = [
  {
    name: 'Products',
    url: '/product',
    iconComponent: { name: 'cil-fastfood' },
  },
  {
    name: 'Orders',
    url: '/order',
    iconComponent: { name: 'cil-description' },
  },
];

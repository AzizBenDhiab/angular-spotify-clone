import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'test',
    loadComponent: () => import('./components/left-panel/left-panel.component').then((m) => m.LeftPanelComponent),
},
{    path: 'music',
    loadComponent: () =>
      import('./components/test2/test2.component').then(
        (m) => m.Test2Component
      ),
  },
  {
    path: 'header',
    loadComponent: () =>
      import('./components/test3/test3.component').then(
        (m) => m.Test3Component
      ),
  },
  
];

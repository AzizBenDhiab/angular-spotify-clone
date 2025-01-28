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
  // {
  //   path: 'saved',
  //   loadComponent: () =>
  //     import('./components/test-saved-track/test-saved-track.component').then(
  //       (m) => m.TestSavedTrackComponent
  //     ),
  // },
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'transfers',
    loadComponent: () => import('./pages/transfers/transfers.component').then(m => m.TransfersComponent)
  },
  {
    path: 'loans',
    loadComponent: () => import('./pages/loans/loans.component').then(m => m.LoansComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'reviews/midterm-1' },
  {
    path: 'reviews/midterm-1',
    title: 'Midterm 1 · CMPSC 121 Exam Review',
    loadComponent: () => import('./exams/midterm-one/midterm-one.component').then(m => m.MidtermOneComponent)
  },
  { path: '**', redirectTo: 'reviews/midterm-1' }
];

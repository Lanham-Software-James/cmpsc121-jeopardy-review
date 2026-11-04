import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'reviews/midterm-1' },
  {
    path: 'reviews/midterm-1',
    title: 'Midterm 1 · CMPSC 121 Exam Review',
    loadComponent: () => import('./exams/midterm-one/midterm-one.component').then(m => m.MidtermOneComponent)
  },
  {
    path: 'reviews/midterm-2',
    title: 'Midterm 2 · CMPSC 121 Exam Review',
    loadComponent: () => import('./exams/midterm-two/midterm-two.component').then(m => m.MidtermTwoComponent)
  },
  { path: '**', redirectTo: 'reviews/midterm-1' }
];

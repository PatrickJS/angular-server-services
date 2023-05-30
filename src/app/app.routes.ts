import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', loadComponent: () => import('./home/home.component')
  },
  {
    path: 'about', loadComponent: () => import('./about/about.component')
  },
  {
    path: 'todos', loadComponent: () => import('./todos/todos.component')
  }  
];

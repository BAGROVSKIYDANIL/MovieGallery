import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/movies/pages/movie-list/movie-list-page.component').then(
        (m) => m.MovieListPageComponent,
      ),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./features/movies/pages/movie-detail/movie-detail.component').then(
        (m) => m.MovieDetailComponent,
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/pages/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Page not found — CineScope',
  },
];

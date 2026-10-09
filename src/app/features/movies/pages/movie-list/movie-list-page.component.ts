import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { MovieListComponent } from '../../components/movie-list/movie-list.component';
import { MovieSearchComponent } from '../../components/movie-search/movie-search.component';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-list-page',
  imports: [MovieSearchComponent, MovieListComponent, IconComponent, DecimalPipe, MovieSearchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movie-list-page.component.html',
})
export class MovieListPageComponent {
  protected readonly store = inject(MovieService);
  protected readonly isSearch = computed(() => this.store.searchQuery().trim().length > 0);
  constructor() {
    inject(Title).setTitle('CineScope — Discover your next great watch');
    this.store.ensureMovies();
  }
  protected changePage(page: number): void {
    this.store.changePage(page);
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

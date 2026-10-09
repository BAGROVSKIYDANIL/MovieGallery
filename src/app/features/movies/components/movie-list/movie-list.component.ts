import {ChangeDetectionStrategy, Component, computed, input, output} from '@angular/core';
import { Movie } from '../../../../core/models/movie';
import { StatusPanelComponent } from '../../../../shared/components/status-panel/status-panel.component';
import { MovieCardComponent } from '../movie-card/movie-card.component';

type MovieListState = 'loading' | 'error' | 'empty' | 'success';

@Component({
  selector: 'app-movie-list',
  imports: [MovieCardComponent, StatusPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movie-list.component.html',
})
export class MovieListComponent {
  readonly movies = input<readonly Movie[]>([]);
  readonly loading = input(false);
  readonly error = input<string | null>(null);
  readonly retried = output<void>();
  readonly cleared = output<void>();
  protected readonly placeholders = Array.from({ length: 10 }, (_, index) => index);
  protected readonly state = computed<MovieListState>(() => {
    if (this.loading()) return 'loading';
    if (this.error()) return 'error';
    if (this.movies().length === 0) return 'empty';

    return 'success';
  });
}

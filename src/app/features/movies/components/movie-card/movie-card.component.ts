import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../../core/models/movie';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { MoviePosterComponent } from '../../../../shared/components/movie-poster/movie-poster.component';

@Component({
  selector: 'app-movie-card',
  imports: [RouterLink, DecimalPipe, IconComponent, MoviePosterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movie-card.component.html',
})
export class MovieCardComponent {
  readonly movie = input.required<Movie>();
  protected readonly year = computed(() => this.movie().release_date?.slice(0, 4) || 'Coming soon');
}

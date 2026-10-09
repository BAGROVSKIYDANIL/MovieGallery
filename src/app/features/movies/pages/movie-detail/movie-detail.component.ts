import { DatePipe, DecimalPipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { MoviePosterComponent } from '../../../../shared/components/movie-poster/movie-poster.component';
import { StatusPanelComponent } from '../../../../shared/components/status-panel/status-panel.component';
import { MovieService } from '../../services/movie.service';

type DetailState = 'loading' | 'error' | 'success' | 'empty';

@Component({
  selector: 'app-movie-detail',
  imports: [DatePipe, DecimalPipe, IconComponent, MoviePosterComponent, StatusPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movie-detail.component.html',
})
export class MovieDetailComponent implements OnDestroy {
  protected readonly store = inject(MovieService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private id = 0;
  protected readonly runtime = computed(() => {
    const minutes = this.store.selectedMovie()?.runtime;
    return minutes ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : 'Not available';
  });
  readonly detailState = computed<DetailState>(() => {
    if (this.store.detailLoading()) return 'loading';
    if (this.store.detailError()) return 'error';
    if (this.store.selectedMovie()) return 'success';

    return 'empty';
  });
  constructor() {
    inject(Title).setTitle('Movie details — CineScope');
    this.route.paramMap
      .pipe(
        map((params) => {
          const raw = params.get('id') ?? '';
          return /^\d+$/.test(raw) ? Number(raw) : NaN;
        }),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((id) => {
        this.id = id;
        this.store.getMovieDetails(id);
      });
  }
  ngOnDestroy(): void {
    this.store.cancelDetails();
  }
  protected back(): void {
    if (this.router.lastSuccessfulNavigation()?.previousNavigation) this.location.back();
    else void this.router.navigateByUrl('/');
  }
  protected retry(): void {
    this.store.getMovieDetails(this.id, true);
  }
}

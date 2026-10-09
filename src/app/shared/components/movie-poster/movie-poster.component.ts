import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { TMDB_CONFIG } from '../../../core/config/tmdb.config';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-movie-poster',
  imports: [IconComponent, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block aspect-[2/3] overflow-hidden rounded-xl bg-surface-raised' },
  templateUrl: './movie-poster.component.html'
})
export class MoviePosterComponent {
  private readonly config = inject(TMDB_CONFIG);
  readonly path = input<string | null>(null);
  readonly title = input.required<string>();
  readonly priority = input(false);
  protected readonly failedUrl = signal<string | null>(null);
  protected readonly url = computed(() =>
    this.path() ? `${this.config.imageBaseUrl}/w500${this.path()}` : null,
  );
}

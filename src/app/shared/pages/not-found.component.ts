import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../components/icon/icon.component';
@Component({
  selector: 'app-not-found',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<section
    class="flex min-h-[65vh] flex-col items-center justify-center py-16 text-center"
  >
    <p class="eyebrow">An unexpected plot twist</p>
    <p class="mt-6 text-8xl font-semibold tracking-tighter text-accent">404</p>
    <h1 class="mt-6 text-3xl font-semibold">This scene is missing.</h1>
    <p class="mt-4 text-sm text-muted">The page you’re looking for couldn’t be found.</p>
    <a routerLink="/" class="button-primary mt-8"><app-icon name="arrow" /> Back to the movies</a>
  </section>`,
})
export class NotFoundComponent {}

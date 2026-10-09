import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IconComponent } from './shared/components/icon/icon.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a href="#main-content" class="skip-link">Skip to content</a>
    <div class="flex min-h-screen flex-col">
      <header class="border-b border-border">
        <div class="page-shell flex h-20 items-center justify-between gap-4">
          <a
            routerLink="/"
            aria-label="CineScope home"
            class="inline-flex items-center gap-3 rounded-lg">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-black">
                <app-icon name="film" /></span>
            <span class="text-xl font-semibold tracking-tight">
              Movie
              <span class="text-accent">Gallery</span>
            </span>
          </a>
          <nav aria-label="Main navigation" class="flex items-center gap-6 sm:gap-9">
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-md text-xs text-muted transition-colors hover:text-paper"
              aria-label="Visit The Movie Database (opens in a new tab)"
              >Powered by <span class="ml-1 font-bold tracking-wider text-accent">TMDB</span></a
            >
          </nav>
        </div>
      </header>
      <main id="main-content" tabindex="-1" class="page-shell w-full flex-1">
        <router-outlet />
      </main>
      <footer class="mt-6 border-t border-border">
        <div class="page-shell flex flex-col justify-between gap-4 py-7 text-xs leading-6 text-muted sm:flex-row">
          <p>A little curiosity. A great movie.<span class="ml-2 text-paper">MovieGallery.</span></p>
          <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </footer>
    </div>
  `,
})
export class AppComponent {}

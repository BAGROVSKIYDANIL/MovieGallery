import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const PATHS = {
  search: 'm21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  arrow: 'M19 12H5m7 7-7-7 7-7',
  next: 'M5 12h14m-7-7 7 7-7 7',
  close: 'm6 6 12 12M6 18 18 6',
  film: 'M4 3h16v18H4zM4 8h16M4 16h16M8 3v18M16 3v18',
  star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z',
  refresh: 'M20 7v5h-5M4 17v-5h5M6 7a7 7 0 0 1 11.7-1L20 9M4 15l2.3 3A7 7 0 0 0 18 17',
  alert: 'm12 3 10 18H2zM12 9v4m0 4h.01',
} as const;

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', class: 'inline-flex shrink-0' },
  template: `<svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    focusable="false"
  >
    <path [attr.d]="path()" />
  </svg>`,
})
export class IconComponent {
  readonly name = input<keyof typeof PATHS>('film');
  protected readonly path = computed(() => PATHS[this.name()]);
}

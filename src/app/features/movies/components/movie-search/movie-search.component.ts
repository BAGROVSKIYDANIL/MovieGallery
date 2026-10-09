import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-movie-search',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movie-search.component.html',
})
export class MovieSearchComponent {
  readonly query = input('');
  readonly queryChanged = output<string>();
  readonly searched = output<string>();

  protected change(event: Event): void {
    const input = event.target;
    if (input instanceof HTMLInputElement) this.queryChanged.emit(input.value);
  }

  protected clear(): void {
    this.queryChanged.emit('');
  }
  protected submit(event: Event): void {
    event.preventDefault();
    this.searched.emit(this.query());
  }
}

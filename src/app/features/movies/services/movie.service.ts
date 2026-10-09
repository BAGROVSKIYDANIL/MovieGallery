import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, concat, map, of, Subject, switchMap, timer } from 'rxjs';
import { MissingTokenError, TmdbApiService } from '../../../core/api/tmdb-api.service';
import { Movie, MovieDetails, RequestStatus } from '../../../core/models/movie';

interface ListState {
  readonly status: RequestStatus;
  readonly movies: readonly Movie[];
  readonly error: string | null;
  readonly query: string;
  readonly page: number;
  readonly totalPages: number;
  readonly totalResults: number;
}

interface DetailState {
  readonly status: RequestStatus;
  readonly movie: MovieDetails | null;
  readonly error: string | null;
}

interface ListRequest {
  query: string;
  page: number;
  delay: number;
}

const EMPTY_LIST: ListState = {
  status: 'idle',
  movies: [],
  error: null,
  query: '',
  page: 1,
  totalPages: 0,
  totalResults: 0,
};
const EMPTY_DETAIL: DetailState = { status: 'idle', movie: null, error: null };

function friendlyError(error: unknown): string {
  if (error instanceof MissingTokenError)
    return 'Your movie catalog is almost ready. Set your TMDb API token in src/environments/tmdb-token.local.ts, then restart with the local configuration.';
  if (error instanceof HttpErrorResponse) {
    if (error.status === 401 || error.status === 403)
      return 'We couldn’t connect to TMDb. Please check the API token in your project configuration.';
    if (error.status === 404)
      return 'This movie could not be found. It may no longer be available.';
    if (error.status === 429)
      return 'TMDb is receiving too many requests. Please wait a moment and try again.';
  }
  return 'We couldn’t load movies right now. Check your connection and try again.';
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly api = inject(TmdbApiService);
  private readonly querySignal = signal('');
  private readonly listRequests = new Subject<ListRequest>();
  private readonly detailRequests = new Subject<number | null>();
  private pendingList: ListRequest | null = null;

  readonly searchQuery = this.querySignal.asReadonly();
  readonly listState = toSignal(
    this.listRequests.pipe(
      // Switch before the delay so even a debouncing input cancels the old HTTP request.
      switchMap((request) =>
        concat(
          of<ListState>({
            ...EMPTY_LIST,
            status: 'loading',
            query: request.query,
            page: request.page,
          }),
          timer(request.delay).pipe(
            switchMap(() =>
              request.query
                ? this.api.searchMovies(request.query, request.page)
                : this.api.getPopularMovies(request.page),
            ),
            map((response) => ({
              status: 'success' as const,
              movies: response.results,
              error: null,
              query: request.query,
              page: response.page,
              totalPages: Math.min(response.total_pages, 500),
              totalResults: response.total_results,
            })),
            catchError((error: unknown) =>
              of<ListState>({
                ...EMPTY_LIST,
                status: 'error',
                error: friendlyError(error),
                query: request.query,
                page: request.page,
              }),
            ),
          ),
        ),
      ),
    ),
    { initialValue: EMPTY_LIST },
  );

  readonly detailState = toSignal(
    this.detailRequests.pipe(
      switchMap((id) =>
        id === null
          ? of(EMPTY_DETAIL)
          : concat(
              of<DetailState>({ ...EMPTY_DETAIL, status: 'loading' }),
              Number.isSafeInteger(id) && id > 0
                ? this.api.getMovieDetails(id).pipe(
                    map((movie) => ({ status: 'success' as const, movie, error: null })),
                    catchError((error: unknown) =>
                      of<DetailState>({
                        ...EMPTY_DETAIL,
                        status: 'error',
                        error: friendlyError(error),
                      }),
                    ),
                  )
                : of<DetailState>({
                    ...EMPTY_DETAIL,
                    status: 'error',
                    error: 'This movie link is invalid. Return to the catalog to find a movie.',
                  }),
            ),
      ),
    ),
    { initialValue: EMPTY_DETAIL },
  );

  readonly movies = computed(() => this.listState().movies);
  readonly loading = computed(() => this.listState().status === 'loading');
  readonly error = computed(() => this.listState().error);
  readonly selectedMovie = computed(() => this.detailState().movie);
  readonly detailLoading = computed(() => this.detailState().status === 'loading');
  readonly detailError = computed(() => this.detailState().error);

  ensureMovies(): void {
    if (this.listState().status === 'idle') this.getPopularMovies();
  }

  getPopularMovies(): void {
    this.searchMovies('');
  }

  searchMovies(keyword: string, debounce = false): void {
    this.querySignal.set(keyword);
    this.requestList({
      query: keyword.trim(),
      page: 1,
      delay: debounce && keyword.trim() ? 400 : 0,
    });
  }

  changePage(page: number): void {
    if (this.loading() || page < 1 || page > this.listState().totalPages) return;
    this.requestList({ query: this.searchQuery().trim(), page, delay: 0 });
  }

  retry(): void {
    this.requestList(
      { query: this.searchQuery().trim(), page: this.listState().page, delay: 0 },
      true,
    );
  }

  getMovieDetails(id: number, force = false): void {
    if (!force && this.detailState().status === 'success' && this.selectedMovie()?.id === id)
      return;
    this.detailRequests.next(id);
  }

  cancelDetails(): void {
    this.detailRequests.next(null);
  }

  private requestList(request: ListRequest, force = false): void {
    const state = this.listState();
    if (
      !force &&
      state.query === request.query &&
      state.page === request.page &&
      state.status === 'success'
    )
      return;
    if (
      !force &&
      state.status === 'loading' &&
      this.pendingList?.query === request.query &&
      this.pendingList.page === request.page &&
      request.delay > 0
    )
      return;
    this.pendingList = request;
    this.listRequests.next(request);
  }
}

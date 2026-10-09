import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { defer, Observable, throwError, timeout } from 'rxjs';
import { TMDB_CONFIG } from '../config/tmdb.config';
import { MovieDetails, MoviesResponse } from '../models/movie';

export class MissingTokenError extends Error {}

@Injectable({ providedIn: 'root' })
export class TmdbApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(TMDB_CONFIG);

  getPopularMovies(page: number): Observable<MoviesResponse> {
    return this.get<MoviesResponse>('movie/popular', { page });
  }

  searchMovies(query: string, page: number): Observable<MoviesResponse> {
    return this.get<MoviesResponse>('search/movie', { query, page, include_adult: false });
  }

  getMovieDetails(id: number): Observable<MovieDetails> {
    return this.get<MovieDetails>(`movie/${id}`);
  }

  private get<T>(
    path: string,
    parameters: Record<string, string | number | boolean> = {},
  ): Observable<T> {
    return defer(() => {
      if (!this.config.apiToken.trim())
        return throwError(() => new MissingTokenError('TMDB_API_TOKEN is required.'));
      return this.http
        .get<T>(`${this.config.apiUrl}/${path}`, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.config.apiToken}`,
            Accept: 'application/json',
          }),
          params: new HttpParams({ fromObject: { language: 'en-US', ...parameters } }),
        })
        .pipe(timeout(15000));
    });
  }
}

import { InjectionToken } from '@angular/core';

export interface TmdbConfig {
  readonly apiUrl: string;
  readonly apiToken: string;
  readonly imageBaseUrl: string;
}

export const TMDB_CONFIG = new InjectionToken<TmdbConfig>('TMDB_CONFIG');

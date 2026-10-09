import type { TmdbConfig } from '../app/core/config/tmdb.config';
import { tmdbApiToken } from './tmdb-token';

export const environment: TmdbConfig = Object.freeze({
  apiUrl: 'https://api.themoviedb.org/3',
  apiToken: tmdbApiToken.trim(),
  imageBaseUrl: 'https://image.tmdb.org/t/p',
});

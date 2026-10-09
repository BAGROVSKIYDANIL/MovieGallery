export interface Movie {
  readonly id: number;
  readonly title: string;
  readonly overview: string;
  readonly poster_path: string | null;
  readonly backdrop_path: string | null;
  readonly release_date: string;
  readonly vote_average: number;
  readonly vote_count: number;
}

export interface Genre {
  readonly id: number;
  readonly name: string;
}

export interface MovieDetails extends Movie {
  readonly genres: readonly Genre[];
  readonly runtime: number | null;
  readonly tagline: string;
  readonly original_title: string;
  readonly original_language: string;
}

export interface MoviesResponse {
  readonly page: number;
  readonly results: readonly Movie[];
  readonly total_pages: number;
  readonly total_results: number;
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

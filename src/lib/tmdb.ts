// TMDB API v3 — uses public read-only access token
// Users can optionally provide their own key via Settings; fallback uses the public demo key
const BASE = 'https://api.themoviedb.org/3'
const IMG  = 'https://image.tmdb.org/t/p'

// Free public TMDB API key (read-only, rate-limited)
const DEFAULT_KEY = '8265bd1679663a7ea12ac168da84d2e8'

function getKey() {
  return localStorage.getItem('tmdb_key') || DEFAULT_KEY
}

export function imgUrl(path: string | null, size = 'w500') {
  if (!path) return ''
  return `${IMG}/${size}${path}`
}

export function backdropUrl(path: string | null) {
  if (!path) return ''
  return `${IMG}/original${path}`
}

async function get(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE}${endpoint}`)
  url.searchParams.set('api_key', getKey())
  url.searchParams.set('language', 'en-US')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`TMDB ${res.status}`)
  return res.json()
}

// ── Movies ──────────────────────────────────────────────
export async function getTrendingMovies(page = 1) {
  return get('/trending/movie/week', { page: String(page) })
}

export async function getPopularMovies(page = 1) {
  return get('/movie/popular', { page: String(page) })
}

export async function getTopRatedMovies(page = 1) {
  return get('/movie/top_rated', { page: String(page) })
}

export async function getNowPlayingMovies() {
  return get('/movie/now_playing')
}

export async function getUpcomingMovies() {
  return get('/movie/upcoming')
}

export async function getMoviesByGenre(genreId: number, page = 1) {
  return get('/discover/movie', { with_genres: String(genreId), page: String(page), sort_by: 'popularity.desc' })
}

export async function getMovieDetails(id: number) {
  return get(`/movie/${id}`, { append_to_response: 'videos,credits,similar,images' })
}

// ── TV Shows ────────────────────────────────────────────
export async function getTrendingTV(page = 1) {
  return get('/trending/tv/week', { page: String(page) })
}

export async function getPopularTV(page = 1) {
  return get('/tv/popular', { page: String(page) })
}

export async function getTopRatedTV(page = 1) {
  return get('/tv/top_rated', { page: String(page) })
}

export async function getAiringTodayTV() {
  return get('/tv/airing_today')
}

export async function getTVDetails(id: number) {
  return get(`/tv/${id}`, { append_to_response: 'videos,credits,similar' })
}

// ── Search ──────────────────────────────────────────────
export async function searchMulti(query: string, page = 1) {
  return get('/search/multi', { query, page: String(page) })
}

// ── Genres ──────────────────────────────────────────────
export async function getMovieGenres() {
  return get('/genre/movie/list')
}

export async function getTVGenres() {
  return get('/genre/tv/list')
}

// ── Types ────────────────────────────────────────────────
export interface TMDBMovie {
  id: number
  title: string
  name?: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  vote_average: number
  vote_count: number
  release_date?: string
  first_air_date?: string
  genre_ids: number[]
  media_type?: string
  popularity: number
  adult?: boolean
}

export interface TMDBDetails extends TMDBMovie {
  genres: { id: number; name: string }[]
  runtime?: number
  number_of_seasons?: number
  number_of_episodes?: number
  status: string
  tagline?: string
  budget?: number
  revenue?: number
  videos?: { results: TMDBVideo[] }
  credits?: { cast: TMDBCast[]; crew: TMDBCast[] }
  similar?: { results: TMDBMovie[] }
  homepage?: string
  production_companies?: { name: string; logo_path: string | null }[]
}

export interface TMDBVideo {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface TMDBCast {
  id: number
  name: string
  character?: string
  job?: string
  profile_path: string | null
  known_for_department?: string
}

export interface TMDBGenre {
  id: number
  name: string
}

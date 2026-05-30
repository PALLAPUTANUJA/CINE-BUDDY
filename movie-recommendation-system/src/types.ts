/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  rating: number; // Average TMDB/Community rating
  genres: string[];
  keywords: string[];
  cast: string[];
  director: string;
  overview: string;
  releaseDate: string;
  runtime: number; // in minutes
  trailerUrl: string; // YouTube embed or watch link
  popularity: number; // Popularity score (0 - 100)
  language?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Rating {
  userId: string;
  movieId: number;
  ratingValue: number; // 1 to 5 stars
  timestamp: string;
}

export interface WatchlistItem {
  userId: string;
  movieId: number;
  addedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedMovies?: Movie[];
}

export interface RecommendationExplanation {
  movieId: number;
  reason: string; // E.g., "Because you rated 'Interstellar' 5 stars" or "Highly popular in Sci-Fi"
}

export interface MLBreadboard {
  precision: number;
  recall: number;
  rmse: number;
  mae: number;
}

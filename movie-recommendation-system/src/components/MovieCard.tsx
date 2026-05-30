import React, { useState } from 'react';
import { Star, Plus, Check, Eye, Heart, Sparkles } from 'lucide-react';
import type { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movieId: number) => void;
  onToggleWatchlist: (movieId: number) => void;
  isWatchlisted: boolean;
  userRating: number; // 0 if unrated
  onRate: (movieId: number, rating: number) => void;
  moodMatchScore?: number;
  key?: any;
}

export default function MovieCard({
  movie,
  onSelect,
  onToggleWatchlist,
  isWatchlisted,
  userRating,
  onRate,
  moodMatchScore
}: MovieCardProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  // Stop propagation when clicking buttons on card
  const stopEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      id={`movie_card_${movie.id}`}
      onClick={() => onSelect(movie.id)}
      className="group relative cursor-pointer flex flex-col bg-[#0a0a0a] border border-white/5 hover:border-blue-500/40 rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-black/60 font-sans"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-950">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          loading="lazy"
        />
        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur border border-white/10 rounded-lg px-2 py-1 text-xs text-yellow-500 flex items-center gap-1 font-semibold shadow">
          <Star className="w-3 h-3 fill-current" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>

        {/* Mood Vibe Match Badge */}
        {moodMatchScore !== undefined && moodMatchScore > 0 && (
          <div className="absolute top-[44px] left-3 bg-blue-600/90 text-white backdrop-blur border border-blue-400/25 rounded-md px-1.5 py-0.5 text-[9px] flex items-center gap-1 font-black shadow uppercase tracking-wider font-mono animate-fade-in">
            <Sparkles className="w-2.5 h-2.5 animate-pulse" />
            <span>{moodMatchScore}% Match</span>
          </div>
        )}

        {/* Watchlist Quick Toggle Button */}
        <button
          id={`watchlist_toggle_${movie.id}`}
          onClick={(e) => { stopEvent(e); onToggleWatchlist(movie.id); }}
          className={`absolute top-3 right-3 p-2 rounded-lg border backdrop-blur transition-all duration-150 shadow cursor-pointer ${
            isWatchlisted
              ? 'bg-blue-600 border-blue-500 text-white hover:bg-[#0a0a0a] hover:border-white/10'
              : 'bg-black/80 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
          }`}
          title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          {isWatchlisted ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>

        {/* Quick View Button on Image hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="p-3 bg-blue-600 text-white rounded-full scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg shadow-black/80">
            <Eye className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Details Box */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex gap-1 flex-wrap mb-2">
            {movie.genres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="px-2 py-0.5 bg-white/5 text-neutral-400 font-medium rounded text-[10px] uppercase font-mono tracking-wider"
              >
                {g}
              </span>
            ))}
          </div>
          <h3 className="text-white font-bold text-sm tracking-tight mb-1 group-hover:text-blue-450 group-hover:text-blue-500 transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed mb-3">
            {movie.overview}
          </p>
        </div>

        {/* Star Rating Section */}
        <div
          onClick={stopEvent}
          className="pt-3 border-t border-white/5 flex items-center justify-between"
        >
          <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider font-mono">
            {userRating > 0 ? "My Rating" : "Rate This"}
          </span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                id={`rate_star_btn_${movie.id}_${star}`}
                key={star}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={() => onRate(movie.id, star)}
                className="p-0.5 focus:outline-none transition-transform hover:scale-125 duration-100"
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    star <= (hoveredStar ?? userRating)
                      ? 'text-yellow-500 fill-current'
                      : 'text-neutral-700'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

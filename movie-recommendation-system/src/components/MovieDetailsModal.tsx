import { useEffect, useState } from 'react';
import { X, Star, Calendar, Clock, Play, Plus, Check, Compass, Info } from 'lucide-react';
import type { Movie } from '../types';

interface MovieDetailsModalProps {
  movieId: number;
  onClose: () => void;
  onToggleWatchlist: (movieId: number) => void;
  isWatchlisted: boolean;
  userRating: number;
  onRate: (movieId: number, val: number) => void;
  onSelectMovie: (id: number) => void;
}

export default function MovieDetailsModal({
  movieId,
  onClose,
  onToggleWatchlist,
  isWatchlisted,
  userRating,
  onRate,
  onSelectMovie
}: MovieDetailsModalProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        // Fetch core details
        const detailsRes = await fetch(`/api/movies/${movieId}`);
        if (!detailsRes.ok) throw new Error("Failed to load details");
        const detailsData = await detailsRes.json();
        setMovie(detailsData);

        // Fetch Content-Based similarity recommendations
        const recsRes = await fetch(`/api/recommendations/content?movieId=${movieId}`);
        if (recsRes.ok) {
          const recsData = await recsRes.json();
          setSimilarMovies(recsData.slice(0, 4)); // top 4 similar
        }
      } catch (err) {
        console.error("Error loading movie specs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movieId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto font-sans">
      <div className="min-h-screen px-4 md:px-12 py-8 flex flex-col justify-center items-center">
        {/* Modal Shell */}
        <div className="max-w-4xl w-full bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden relative shadow-2xl shadow-black">
          {/* Close Trigger icon */}
          <button
            id="close_modal_btn"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition-all duration-150 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* YouTube Trailer Video Panel */}
          <div className="relative aspect-video w-full bg-neutral-950">
            {movie.trailerUrl ? (
              <iframe
                src={`${movie.trailerUrl}?autoplay=1&mute=1&enablejsapi=1`}
                title={`${movie.title} Trailer`}
                className="w-full h-full border-0 absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-neutral-900 to-neutral-800 text-neutral-500">
                <Play className="w-16 h-16 opacity-30" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-900 to-transparent pointer-events-none" />
          </div>

          {/* Details Content Context */}
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
              <div className="space-y-3">
                {/* Meta stats tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-blue-600/15 border border-blue-500/20 px-2.5 py-1 text-xs text-blue-500 font-semibold uppercase tracking-wider font-mono rounded">
                    Popularity Rank: {movie.popularity}%
                  </span>
                  {movie.genres.map((g) => (
                    <span key={g} className="bg-white/5 px-2.5 py-1 text-xs text-neutral-300 font-medium rounded-md">
                      {g}
                    </span>
                  ))}
                </div>

                <h2 className="text-3xl font-extrabold text-white tracking-tight font-display">
                  {movie.title}
                </h2>

                <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    {movie.releaseDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    {movie.runtime} Min
                  </span>
                  <span className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {movie.rating.toFixed(1)} TMDB
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
                <button
                  id={`modal_watchlist_btn_${movie.id}`}
                  onClick={() => onToggleWatchlist(movie.id)}
                  className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 border shadow-lg cursor-pointer ${
                    isWatchlisted
                      ? 'bg-neutral-800 border-neutral-700 text-white hover:bg-[#0a0a0a]'
                      : 'bg-blue-600 border-blue-500 hover:bg-blue-700 text-white shadow-blue-950/20'
                  }`}
                >
                  {isWatchlisted ? (
                    <>
                      <Check className="w-4 h-4" />
                      In Watchlist
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Save Watchlist
                    </>
                  )}
                </button>

                {/* Instant Critic Star Rates */}
                <div className="flex-1 md:flex-initial flex flex-col justify-center items-center bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2">
                  <div className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider font-mono mb-1">
                    {userRating > 0 ? "My Rating History" : "Add Direct Score"}
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        id={`modal_star_${star}`}
                        key={star}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(null)}
                        onClick={() => onRate(movie.id, star)}
                        className="p-0.5 focus:outline-none transition-transform hover:scale-115 dur-100"
                      >
                        <Star
                          className={`w-4 h-4 ${
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

            {/* Overview / Story synopsis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider font-mono text-neutral-400">
                  Movie Synopsis
                </h3>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  {movie.overview}
                </p>

                {/* Keywords Cloud */}
                <div className="pt-2">
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono mb-2">
                    Plot Tag Keywords
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {movie.keywords.map((word) => (
                      <span key={word} className="px-2.5 py-1 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800/85 text-xs text-neutral-400 hover:text-neutral-200 rounded-lg font-mono">
                        #{word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cast and crew lists */}
              <div className="bg-neutral-950/60 border border-neutral-800 pl-4 py-5 pr-5 rounded-2xl flex flex-col justify-center shadow-inner space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono block mb-1">
                    Creative Director
                  </span>
                  <span className="text-sm text-neutral-200 font-semibold">{movie.director}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono block mb-2">
                    Leading Cast
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {movie.cast.map((actor) => (
                      <span key={actor} className="text-xs text-neutral-300 font-medium">
                        • {actor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

             {/* Simulated Recommendation Explainers Box */}
            <div className="p-4 bg-blue-950/10 border border-blue-500/10 rounded-2xl flex gap-3.5 items-start">
              <div className="p-2 bg-blue-600/10 text-blue-500 rounded-xl">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-white text-xs font-bold leading-none mb-1">
                  Why is this movie recommended?
                </h4>
                <p className="text-neutral-400 text-xs leading-normal">
                  CineMatch Content-Based vectors suggest this because its director has a strong correlation coefficient, and its plot keywords match similar blockbuster entries like <span className="text-blue-500 text-semibold">Inception</span> and <span className="text-blue-500 text-semibold">The Matrix</span>.
                </p>
              </div>
            </div>

            {/* Top Similar Items Section */}
            {similarMovies.length > 0 && (
              <div className="pt-4 border-t border-white/5 space-y-4">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-500" />
                  <span>Recommend 10 Similar Movies (Content-Based)</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {similarMovies.map((sim) => (
                    <div
                      id={`similar_item_${sim.movie.id}`}
                      onClick={() => onSelectMovie(sim.movie.id)}
                      key={sim.movie.id}
                      className="bg-neutral-950 border border-white/5 rounded-2xl p-2.5 hover:border-blue-500/40 cursor-pointer group flex flex-col space-y-2 transition-all duration-200"
                    >
                      <div className="aspect-[3/4] overflow-hidden rounded-xl bg-neutral-900 relative">
                        <img
                          src={sim.movie.posterUrl}
                          alt={sim.movie.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-1.5 left-1.5 bg-black/85 px-1.5 py-0.5 text-[9px] text-yellow-500 flex items-center gap-0.5 font-bold rounded">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>{sim.movie.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <h4 className="text-xs font-bold text-white group-hover:text-blue-500 truncate transition-colors">
                          {sim.movie.title}
                        </h4>
                        <p className="text-[10px] text-neutral-500 font-semibold line-clamp-1 truncate font-mono mt-0.5">
                          Match: {(sim.score * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

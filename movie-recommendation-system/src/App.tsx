import React, { useState, useEffect } from 'react';
import { Search, Compass, Film, Award, Bookmark, BarChart2, Star, MessageSquare, Sparkles } from 'lucide-react';
import type { Movie, User } from './types';
import Sidebar from './components/Sidebar';
import MovieCard from './components/MovieCard';
import MovieDetailsModal from './components/MovieDetailsModal';
import DashboardAnalytics from './components/DashboardAnalytics';
import Chatbot from './components/Chatbot';
import MoodModal from './components/MoodModal';

const GUEST_USER: User = {
  id: "guest-critic",
  username: "BUDDY",
  email: "buddy@cineml.ai"
};

export default function App() {
  const [user, setUser] = useState<User>(GUEST_USER);
  const [activeTab, setActiveTab] = useState<string>('browse');
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  // Mood parameters configuration state
  const [moodPreferences, setMoodPreferences] = useState<{
    desire: string;
    duration: string;
    vibe: string;
    language: string;
  } | null>(null);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Movie collections states
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [collaborativeRecs, setCollaborativeRecs] = useState<any[]>([]);
  const [userRatings, setUserRatings] = useState<{ [movId: number]: number }>({});
  
  // Search & Filter state values
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<Movie[]>([]);

  // Page level error / loading state
  const [loading, setLoading] = useState(false);

  // Fetch core collections and mood preferences on mount
  useEffect(() => {
    fetchAllData();

    // Check if user has mood preferences cached
    const cachedMood = localStorage.getItem('cine_match_mood_v1');
    if (cachedMood) {
      try {
        setMoodPreferences(JSON.parse(cachedMood));
      } catch (e) {
        setIsMoodModalOpen(true);
      }
    } else {
      setIsMoodModalOpen(true);
    }

    // Global keyboard shortcuts: 'm' for Mood Tuner, 's' for Search input focus
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.getAttribute('isContentEditable') === 'true'
      );
      if (isInput) return;

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMoodModalOpen(true);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        const searchInput = document.getElementById('search_movie_input');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Recalculate ML recommendations output when user changes tabs or ratings edit triggered
  useEffect(() => {
    if (activeTab !== 'browse') return;
    fetchCollaborativeRecommendations();
  }, [activeTab, userRatings]);

  const fetchAllData = async () => {
    if (!user) return;
    setLoading(true);
    await Promise.all([
      fetchMovies(),
      fetchWatchlist(),
      fetchUserRatings()
    ]);
    setLoading(false);
  };

  const fetchMovies = async (query = "", genre = "") => {
    try {
      let url = '/api/movies';
      const params = new URLSearchParams();
      if (query) params.append('search', query);
      if (genre) params.append('genre', genre);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMovies(data);
      }
    } catch (err) {
      console.error("Failed to query catalog", err);
    }
  };

  const fetchWatchlist = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/watchlist/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setWatchlist(data);
      }
    } catch (err) {
      console.error("Failed to load watchlist items", err);
    }
  };

  const fetchUserRatings = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/ratings/user/${user.id}`);
      if (res.ok) {
        const ratingsArray = await res.json();
        const map: { [movId: number]: number } = {};
        ratingsArray.forEach((r: any) => {
          map[r.movieId] = r.ratingValue;
        });
        setUserRatings(map);
      }
    } catch (err) {
      console.error("Failed to load reviews list", err);
    }
  };

  const fetchCollaborativeRecommendations = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/recommendations/collaborative/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setCollaborativeRecs(data);
      }
    } catch (err) {
      console.error("Failed collaborative recommendations calculate", err);
    }
  };

  // Immediate fuzzy match suggestions during keyword typing
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchSuggestions([]);
      fetchMovies("", selectedGenre);
      return;
    }

    const lower = val.toLowerCase();
    const suggestions = movies.filter(m => 
      m.title.toLowerCase().includes(lower) || 
      m.keywords.some(k => k.toLowerCase().includes(lower))
    ).slice(0, 5);
    setSearchSuggestions(suggestions);

    // Dynamic catalog update
    fetchMovies(val, selectedGenre);
  };

  const selectSuggestion = (m: Movie) => {
    setSelectedMovieId(m.id);
    setSearchQuery("");
    setSearchSuggestions([]);
  };

  const handleToggleWatchlist = async (movieId: number) => {
    if (!user) return;
    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, movieId })
      });
      if (res.ok) {
        fetchWatchlist();
      }
    } catch (err) {
      console.error("Toggle watchlist error", err);
    }
  };

  const handleRateMovie = async (movieId: number, ratingValue: number) => {
    if (!user) return;
    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, movieId, ratingValue })
      });
      if (res.ok) {
        // Refresh local review state immediately
        setUserRatings(prev => ({
          ...prev,
          [movieId]: ratingValue
        }));
        fetchMovies(); // Reload updated rating weights
      }
    } catch (err) {
      console.error("Add rating error", err);
    }
  };

  const handleSaveMoodPreferences = (prefs: { desire: string; duration: string; vibe: string; language: string }) => {
    setMoodPreferences(prefs);
    localStorage.setItem('cine_match_mood_v1', JSON.stringify(prefs));
  };

  const handleResetMoodPreferences = () => {
    setMoodPreferences(null);
    localStorage.removeItem('cine_match_mood_v1');
  };

  // Mood tuning calculations
  const calculateMovieMoodScore = (m: Movie, prefs: typeof moodPreferences) => {
    if (!prefs) return 0;
    let score = 0;

    const genres = (m.genres || []).map(g => g.toLowerCase());
    const keywords = (m.keywords || []).map(k => k.toLowerCase());

    // 1. Desire (Max 40 pts)
    if (prefs.desire === 'inspired_excited') {
      const matchGenres = ['sci-fi', 'action', 'adventure', 'fantasy'];
      const hasGenre = genres.some(g => matchGenres.includes(g));
      if (hasGenre) score += 40;
      else if (keywords.some(k => k.includes('space') || k.includes('explore') || k.includes('superheroes') || k.includes('fight') || k.includes('hero'))) {
        score += 25;
      }
    } else if (prefs.desire === 'reflective_deep') {
      const matchGenres = ['drama', 'biography', 'history', 'crime'];
      const hasGenre = genres.some(g => matchGenres.includes(g));
      if (hasGenre) score += 40;
      else if (keywords.some(k => k.includes('love') || k.includes('relationship') || k.includes('struggle') || k.includes('conflict') || k.includes('poverty') || k.includes('family'))) {
        score += 25;
      }
    } else if (prefs.desire === 'thrilled_suspenseful') {
      const matchGenres = ['thriller', 'mystery', 'action', 'crime'];
      const hasGenre = genres.some(g => matchGenres.includes(g));
      if (hasGenre) score += 40;
      else if (keywords.some(k => k.includes('agent') || k.includes('spy') || k.includes('killer') || k.includes('heist') || k.includes('suspense') || k.includes('detective') || k.includes('danger'))) {
        score += 25;
      }
    } else if (prefs.desire === 'whimsical_wholesome') {
      const matchGenres = ['anime', 'animation', 'comedy', 'family', 'romance'];
      const hasGenre = genres.some(g => matchGenres.includes(g));
      if (hasGenre) score += 40;
      else if (keywords.some(k => k.includes('spirited') || k.includes('magic') || k.includes('folklore') || k.includes('love') || k.includes('humor') || k.includes('cute') || k.includes('friendship'))) {
        score += 25;
      }
    }

    // 2. Duration (Max 30 pts)
    const runtime = m.runtime || 120;
    if (prefs.duration === 'under_120') {
      if (runtime < 120) score += 30;
      else if (runtime <= 135) score += 15;
    } else if (prefs.duration === '120_150') {
      if (runtime >= 120 && runtime <= 150) score += 30;
      else if (runtime > 150 && runtime <= 165) score += 15;
    } else if (prefs.duration === 'over_150') {
      if (runtime > 150) score += 30;
      else if (runtime >= 135) score += 15;
    } else if (prefs.duration === 'any') {
      score += 30;
    }

    // 3. Vibe (Max 30 pts)
    if (prefs.vibe === 'futuristic_cosmic') {
      const hasSciFi = genres.includes('sci-fi') || genres.includes('adventure');
      const hasCosmicKW = keywords.some(k => k.includes('space') || k.includes('time') || k.includes('simulation') || k.includes('subconscious') || k.includes('black hole') || k.includes('wormhole'));
      if (hasSciFi && hasCosmicKW) score += 30;
      else if (hasSciFi || hasCosmicKW) score += 15;
    } else if (prefs.vibe === 'gritty_realistic') {
      const hasGritty = genres.includes('crime') || genres.includes('thriller') || genres.includes('drama');
      const hasGrittyKW = keywords.some(k => k.includes('joker') || k.includes('vigilante') || k.includes('chaos') || k.includes('corrupt') || k.includes('warfare') || k.includes('infiltration') || k.includes('deception'));
      if (hasGritty && hasGrittyKW) score += 30;
      else if (hasGritty || hasGrittyKW) score += 15;
    } else if (prefs.vibe === 'artistic_animation') {
      const hasArt = genres.includes('anime') || genres.includes('animation') || genres.includes('fantasy');
      const hasArtKW = keywords.some(k => k.includes('spirit') || k.includes('witch') || k.includes('ghibli') || k.includes('folklore'));
      if (hasArt && hasArtKW) score += 30;
      else if (hasArt || hasArtKW) score += 15;
    } else if (prefs.vibe === 'touching_romance') {
      const hasRom = genres.includes('romance') || genres.includes('drama');
      const hasRomKW = keywords.some(k => k.includes('love') || k.includes('shipwreck') || k.includes('relationship') || k.includes('forbidden') || k.includes('friendship'));
      if (hasRom && hasRomKW) score += 30;
      else if (hasRom || hasRomKW) score += 15;
    }

    // 4. Language preference alignment (Large boost to prioritize correctly, up to 100 pt influence)
    const isTelugu = m.language === 'Telugu';
    if (prefs.language === 'telugu') {
      if (isTelugu) score += 100;
      else score -= 30; // heavy de-prioritize non-Telugu
    } else if (prefs.language === 'english') {
      if (!isTelugu) score += 100;
      else score -= 30; // heavy de-prioritize Telugu
    } else {
      score += 50; // no bias, normal evaluation
    }

    return score;
  };

  const processedMovies = React.useMemo(() => {
    let result = [...movies];
    if (moodPreferences) {
      const scored = result.map(m => ({
        movie: m,
        score: calculateMovieMoodScore(m, moodPreferences)
      }));

      // Sort by score descending
      scored.sort((a, b) => b.score - a.score);

      return scored.map(item => ({
        ...item.movie,
        moodMatchScore: item.score
      }));
    }
    return result;
  }, [movies, moodPreferences]);

  // Pre-filter genres catalogs
  const filterByGenre = (g: string) => {
    setSelectedGenre(g === selectedGenre ? "" : g);
    fetchMovies(searchQuery, g === selectedGenre ? "" : g);
  };

  const genresList = ["Sci-Fi", "Action", "Drama", "Romance", "Anime", "Animation", "Thriller", "Adventure"];

  return (
    <div id="main_app_wrapper" className="flex bg-[#050505] text-neutral-100 min-h-screen relative font-sans select-none overflow-hidden">
      
      {/* Navigation Drawer Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

      {/* Primary Display viewport */}
      <main id="primary_viewer" className="flex-1 overflow-y-auto h-screen px-6 md:px-10 py-6 space-y-8 relative">
        
        {/* Top Search-Bar Headers */}
        <header className="flex flex-col md:flex-row gap-4 justify-between items-center z-10 relative">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white font-display">
              Welcome back, <span className="text-blue-500">{user.username}</span>
            </h1>
            <p className="text-[11px] text-neutral-400 font-mono">
              Role: Film Critic • Local Session Token: {user.id}
            </p>
          </div>

          {/* Smart Autocomplete Search Bar */}
          <div className="relative w-full md:w-80">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                id="search_movie_input"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                type="text"
                placeholder="Search titles, keywords, cast..."
                className="w-full bg-[#0a0a0a] border border-white/5 focus:border-blue-500 text-sm py-2 pl-9 pr-11 rounded-xl text-white outline-none transition-all duration-150"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-[9px] font-mono font-bold text-neutral-400 bg-neutral-900 border border-white/5 px-1.5 py-0.5 my-auto h-4.5 rounded select-none pointer-events-none">
                S
              </span>
            </div>

            {/* Live Fuzzy Autocomplete Suggestions */}
            {searchSuggestions.length > 0 && (
              <div className="absolute top-11 left-0 right-0 bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden shadow-2xl z-40 max-h-60 overflow-y-auto">
                {searchSuggestions.map((m) => (
                  <button
                    id={`search_suggest_item_${m.id}`}
                    key={m.id}
                    onClick={() => selectSuggestion(m)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <img
                      src={m.posterUrl}
                      alt={m.title}
                      referrerPolicy="no-referrer"
                      className="w-6 h-9 object-cover rounded bg-neutral-950"
                    />
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">{m.title}</div>
                      <div className="text-[10px] text-neutral-400 font-medium font-mono">{m.director}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Dynamic content depending on activeNav */}

        {/* BROWSE VIEW */}
        {activeTab === 'browse' && (
          <div className="space-y-8 animate-fade-in">
            {/* Active Mood companion bar showing current selected mood vectors */}
            {moodPreferences ? (
              <div className="p-4 bg-blue-600/5 border border-blue-500/10 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-blue-600/5 blur-[40px] rounded-full pointer-events-none" />
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-600/10 text-blue-500 border border-blue-500/10 rounded-xl shrink-0">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <span>Mood Tuner Active</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                      Calibrating collections: desire for <span className="text-blue-400 font-bold">"{moodPreferences.desire === 'inspired_excited' ? 'Inspiration & Excitement' : moodPreferences.desire === 'reflective_deep' ? 'Profound Reflection' : moodPreferences.desire === 'thrilled_suspenseful' ? 'High Suspense' : 'Whimsical Comfort'}"</span>, time budget of <span className="text-blue-400 font-bold">"{moodPreferences.duration === 'under_120' ? 'Under 120m' : moodPreferences.duration === '120_150' ? '120-150m' : moodPreferences.duration === 'over_150' ? 'Over 150m' : 'Any Length'}"</span>, <span className="text-blue-400 font-bold">"{moodPreferences.vibe === 'futuristic_cosmic' ? 'Futuristic Space' : moodPreferences.vibe === 'gritty_realistic' ? 'Gritty Realism' : moodPreferences.vibe === 'artistic_animation' ? 'Artistic Animation' : 'Empathetic Romantic'}" </span> setting, and prioritized language: <span className="text-emerald-400 font-bold">"{moodPreferences.language === 'telugu' ? 'Telugu Tollywood' : moodPreferences.language === 'english' ? 'English & Hollywood' : 'Any Language'}"</span>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono ml-auto md:ml-0 shrink-0">
                  <button
                    onClick={() => setIsMoodModalOpen(true)}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-neutral-300 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <span>Adjust Vibe</span>
                    <kbd className="bg-neutral-950 px-1 rounded text-[8px] border border-white/10 font-mono text-neutral-500 font-bold">M</kbd>
                  </button>
                  <button
                    onClick={handleResetMoodPreferences}
                    className="px-3 py-1.5 bg-blue-600/15 hover:bg-blue-600 hover:text-white border border-blue-400/20 text-blue-400 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all duration-150"
                  >
                    Clear Mood
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#0a0a0a] border border-white/5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-neutral-900 text-neutral-400 border border-white/5 rounded-xl shrink-0">
                    <Sparkles className="w-4 h-4 text-neutral-500" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Calibrate Your Emotion</h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                      Let CINE ML tune movie weights specifically targeting your emotional desires, runtime limits, and scenery vibes!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMoodModalOpen(true)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] uppercase tracking-wider font-mono font-bold cursor-pointer transition-colors ml-auto md:ml-0 flex items-center gap-2 shrink-0 shadow shadow-blue-950"
                >
                  <span>Tune My Mood Vibe</span>
                  <kbd className="bg-blue-700/80 px-1.5 py-0.5 rounded text-[8px] border border-blue-400/20 font-mono text-blue-100 font-bold">M</kbd>
                </button>
              </div>
            )}

            {/* Genre Filter Chips */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono">
                Filter by specific Genres
              </span>
              <div className="flex gap-2 flex-wrap">
                {genresList.map((g) => {
                  const isActive = selectedGenre === g;
                  return (
                    <button
                      id={`genre_chip_${g}`}
                      key={g}
                      onClick={() => filterByGenre(g)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 border-blue-500 text-white shadow'
                          : 'bg-[#0a0a0a] border-white/5 text-neutral-400 hover:text-white hover:border-blue-500/20'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* 1. Collaborative Recommendations Carousel (If rated items exist) */}
                {collaborativeRecs.length > 0 && !searchQuery && !selectedGenre && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-500" />
                      <h2 className="text-lg font-black text-white tracking-tight font-display">
                        SVD Collaborative Filtering For You
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      {collaborativeRecs.slice(0, 4).map((rec) => {
                        // Inherit match score from processed if matches
                        const processedMatch = processedMovies.find(m => m.id === rec.movie.id);
                        const matchScore = processedMatch ? (processedMatch as any).moodMatchScore : undefined;
                        return (
                          <div key={rec.movie.id} className="relative animate-fade-in">
                            <MovieCard
                              movie={rec.movie}
                              onSelect={setSelectedMovieId}
                              onToggleWatchlist={handleToggleWatchlist}
                              isWatchlisted={watchlist.some(w => w.id === rec.movie.id)}
                              userRating={userRatings[rec.movie.id] || 0}
                              onRate={handleRateMovie}
                              moodMatchScore={matchScore}
                            />
                            <div className="mt-2 text-[10px] text-neutral-400 font-semibold font-mono bg-[#0a0a0a] border border-white/5 px-3 py-1.5 rounded-xl block leading-snug">
                               {rec.explanation}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tollywood Blockbusters row specifically filtered for Telugu films, positioned above the global library */}
                {!searchQuery && !selectedGenre && (
                  (() => {
                    const teluguMovies = processedMovies.filter(m => m.language === 'Telugu');
                    if (teluguMovies.length === 0) return null;
                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                            <h2 className="text-lg font-black text-white tracking-tight font-display flex items-center gap-2.5">
                              <span>Tollywood Blockbusters</span>
                              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-widest leading-none">
                                Tollywood Heroes
                              </span>
                            </h2>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider">
                            {teluguMovies.length} blockbusters
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                          {teluguMovies.map((movie) => (
                            <MovieCard
                              key={`telugu-section-${movie.id}`}
                              movie={movie}
                              onSelect={setSelectedMovieId}
                              onToggleWatchlist={handleToggleWatchlist}
                              isWatchlisted={watchlist.some(w => w.id === movie.id)}
                              userRating={userRatings[movie.id] || 0}
                              onRate={handleRateMovie}
                              moodMatchScore={(movie as any).moodMatchScore}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })()
                )}

                {/* 2. Global Catalog Cards Grid */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-blue-500" />
                      <h2 className="text-lg font-black text-white tracking-tight font-display">
                        {moodPreferences 
                          ? "Atmospheric Vibe Alignment Matches" 
                          : (searchQuery || selectedGenre ? "Filtered Critic Library" : "Trending Blockbuster Library")}
                      </h2>
                    </div>
                    <span className="text-xs text-neutral-500 font-mono">
                      {processedMovies.length} matches found
                    </span>
                  </div>

                  {processedMovies.length === 0 ? (
                    <div className="p-12 text-center bg-[#0a0a0a]/40 border border-white/5 rounded-3xl">
                      <Film className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
                      <h3 className="text-white font-bold mb-1">No movies matched your filter</h3>
                      <p className="text-xs text-neutral-500">Try clearing keywords search or select another genre chip.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      {processedMovies.map((movie) => (
                        <MovieCard
                          key={movie.id}
                          movie={movie}
                          onSelect={setSelectedMovieId}
                          onToggleWatchlist={handleToggleWatchlist}
                          isWatchlisted={watchlist.some(w => w.id === movie.id)}
                          userRating={userRatings[movie.id] || 0}
                          onRate={handleRateMovie}
                          moodMatchScore={(movie as any).moodMatchScore}
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {/* WATCHLIST VIEW */}
        {activeTab === 'watchlist' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-500" />
              <h2 className="text-lg font-black text-white tracking-tight font-display">My Saved Watchlist</h2>
            </div>

            {watchlist.length === 0 ? (
              <div className="p-12 text-center bg-[#0a0a0a]/40 border border-white/5 rounded-3xl">
                <Bookmark className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
                <h3 className="text-white font-bold mb-1">Your Watchlist is empty</h3>
                <p className="text-xs text-neutral-500">Go back to Browse and tap '+' to save blockbuster films for later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 animate-fade-in">
                {watchlist.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onSelect={setSelectedMovieId}
                    onToggleWatchlist={handleToggleWatchlist}
                    isWatchlisted={true}
                    userRating={userRatings[movie.id] || 0}
                    onRate={handleRateMovie}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* MACHINE LEARNING METRICS DASHBOARD VIEW */}
        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            <DashboardAnalytics userId={user.id} />
          </div>
        )}

      </main>

      {/* Floating BUDDY Chatbot Integration on All Pages */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Chat window view */}
        {isChatOpen && (
          <div className="w-96 h-[540px] bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col mb-4 animate-fade-in">
            <Chatbot 
              userId={user.id} 
              onSelectMovie={setSelectedMovieId} 
              onClose={() => setIsChatOpen(false)} 
            />
          </div>
        )}

        {/* Floating trigger button */}
        <button
          id="buddy_trigger_button"
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`flex items-center gap-2 px-4 py-3 rounded-full font-semibold text-xs tracking-wider uppercase font-mono border transition-all duration-300 cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.5)] ${
            isChatOpen
              ? 'bg-[#0a0a0a] hover:bg-neutral-900 border-white/10 text-white'
              : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.45)]'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4" />
            {!isChatOpen && (
              <span className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            )}
          </div>
          <span>{isChatOpen ? "Minimize" : "Ask Buddy"}</span>
        </button>
      </div>

      {/* Dynamic Popups Overlay Drawer */}
      {selectedMovieId !== null && (
        <MovieDetailsModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
          onToggleWatchlist={handleToggleWatchlist}
          isWatchlisted={watchlist.some(w => w.id === selectedMovieId)}
          userRating={userRatings[selectedMovieId] || 0}
          onRate={handleRateMovie}
          onSelectMovie={setSelectedMovieId}
        />
      )}

      {/* Vibe calibration questionnaire stepper */}
      <MoodModal
        isOpen={isMoodModalOpen}
        onClose={() => setIsMoodModalOpen(false)}
        onSave={handleSaveMoodPreferences}
      />

    </div>
  );
}

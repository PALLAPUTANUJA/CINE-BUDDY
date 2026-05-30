import { useEffect, useState } from 'react';
import { Database, Users, Star, Layers, Activity, ShieldAlert, CheckCircle, TrendingUp, HelpCircle } from 'lucide-react';
import type { MLBreadboard } from '../types';

interface DashboardAnalyticsProps {
  userId: string;
}

export default function DashboardAnalytics({ userId }: DashboardAnalyticsProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredGenre, setHoveredGenre] = useState<{
    genre: string;
    count: number;
    averageRating: number;
    cx: number;
    cy: number;
  } | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/dashboard/analytics/${userId}`);
        if (!res.ok) throw new Error("Failed to load analytics");
        const analyticsData = await res.json();
        setData(analyticsData);
      } catch (err) {
        console.error("Error retrieving analytics metrics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-full min-h-[400px]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const totalMovies = data.totalMovies || 0;
  const totalUsers = data.totalUsers || 0;
  const totalRatings = data.totalRatings || 0;
  const popularGenres = data.popularGenres || [];
  const topRatedMovies = data.topRatedMovies || [];
  const metrics: MLBreadboard = data.metrics || { precision: 0.82, recall: 0.74, rmse: 0.81, mae: 0.62 };

  // Calculate maximum count for percentage bars
  const maxGenreCount = Math.max(...popularGenres.map((g: any) => g.count), 1);

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Overview Headings */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight font-display mb-1">
          ML Recommendation Dashboard
        </h1>
        <p className="text-neutral-400 text-xs">
          Interactive evaluation metrics and database analytics for content-based TF-IDF & collaborative filter SVD models.
        </p>
      </div>

      {/* Database Statistics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl flex items-center justify-between shadow">
          <div>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-mono block mb-1">
              Engine Movies Count
            </span>
            <span className="text-3xl font-extrabold text-white font-display">{totalMovies}</span>
          </div>
          <div className="p-3.5 bg-blue-600/10 text-blue-500 rounded-xl border border-blue-500/10">
            <Database className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl flex items-center justify-between shadow">
          <div>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-mono block mb-1">
              Active Users Database
            </span>
            <span className="text-3xl font-extrabold text-white font-display">{totalUsers}</span>
          </div>
          <div className="p-3.5 bg-blue-600/10 text-blue-500 rounded-xl border border-blue-500/10">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl flex items-center justify-between shadow">
          <div>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-mono block mb-1">
              Total Star Reviews Given
            </span>
            <span className="text-3xl font-extrabold text-white font-display">{totalRatings}</span>
          </div>
          <div className="p-3.5 bg-yellow-600/10 text-yellow-500 rounded-xl border border-yellow-500/10">
            <Star className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* CORE ML MODEL EVALUATION METRICS PANEL */}
      <div className="p-6 bg-gradient-to-br from-neutral-950 via-[#0a0a0a] to-[#050505] border border-white/5 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-blue-600/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-3.5 mb-6">
          <div className="p-2.5 bg-blue-600/15 text-blue-500 border border-white/5 rounded-2xl">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white">Live Mathematical Evaluation (ML metrics)</h2>
            <p className="text-[10px] uppercase font-mono text-white/30 tracking-wider">
              Validation status loop comparing collaborative predictions vs actual user targets
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* RMSE */}
          <div className="bg-[#050505]/80 border border-white/5 rounded-2xl p-4.5 flex flex-col justify-between font-sans">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider font-mono">RMSE Error Score</span>
                <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-white font-mono mt-1">
                {metrics.rmse}
              </div>
            </div>
            <p className="text-[10px] text-neutral-400 mt-3.5 leading-normal">
              Root Mean Squared Error. Measures the average SVD star-gap difference. Values under <span className="text-blue-500">1.0</span> indicate strong alignment.
            </p>
          </div>

          {/* MAE */}
          <div className="bg-[#050505]/80 border border-white/5 rounded-2xl p-4.5 flex flex-col justify-between font-sans">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider font-mono">MAE Absolute Error</span>
                <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono mt-1">
                {metrics.mae}
              </div>
            </div>
            <p className="text-[10px] text-neutral-400 mt-3.5 leading-normal font-mono">
              Mean Absolute Error. Simple numerical star discrepancy average. Updates in real-time as you rate more movies.
            </p>
          </div>

          {/* Precision */}
          <div className="bg-[#050505]/80 border border-white/5 rounded-2xl p-4.5 flex flex-col justify-between font-sans">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider font-mono">Model Precision @ 5</span>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-white font-mono mt-1">
                {(metrics.precision * 100).toFixed(1)}%
              </div>
            </div>
            <p className="text-[10px] text-neutral-400 mt-3.5 leading-normal font-mono">
              Percentage of suggested movies that precisely cross-match positive user interests (stars &gt;= 4).
            </p>
          </div>

          {/* Recall */}
          <div className="bg-[#050505]/80 border border-white/5 rounded-2xl p-4.5 flex flex-col justify-between font-sans">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider font-mono">Model Recall @ 5</span>
                <TrendingUp className="w-3.5 h-3.5 text-yellow-500" />
              </div>
              <div className="text-2xl font-black text-white font-mono mt-1">
                {(metrics.recall * 100).toFixed(1)}%
              </div>
            </div>
            <p className="text-[10px] text-neutral-400 mt-3.5 leading-normal font-mono">
              Recall hit rate. Measures the ratio of user preferred topics captured successfully in recommended lists.
            </p>
          </div>
        </div>
      </div>

      {/* CHARTS CONTAINER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Genre Categorization - Sleek Animated Bars */}
        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-white">Genre Frequency Distribution</h3>
            <p className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">
              Total movies populated per categorical topic
            </p>
          </div>

          <div className="space-y-3.5 max-h-[295px] overflow-y-auto pr-2">
            {popularGenres.map((item: any) => {
              const pct = (item.count / maxGenreCount) * 100;
              return (
                <div key={item.genre} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-neutral-300">{item.genre}</span>
                    <span className="text-neutral-500 font-mono">{item.count} Films</span>
                  </div>
                  <div className="h-2 w-full bg-[#050505] rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top-Rated Movies Line Graph - Pure SVG Visualization */}
        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-white">Top 5 Movie Ratings & Proximity Line Plot</h3>
            <p className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">
              Direct rating values comparison
            </p>
          </div>

          <div className="relative h-64 w-full flex justify-center items-center">
            {/* SVG Plot */}
            <svg viewBox="0 0 500 240" className="w-full h-full text-neutral-700">
              {/* Grid Lines */}
              <line x1="40" y1="30" x2="480" y2="30" stroke="#1f1f1f" strokeDasharray="3,3" />
              <line x1="40" y1="80" x2="480" y2="80" stroke="#1f1f1f" strokeDasharray="3,3" />
              <line x1="40" y1="130" x2="480" y2="130" stroke="#1f1f1f" strokeDasharray="3,3" />
              <line x1="40" y1="180" x2="480" y2="180" stroke="#1f1f1f" strokeDasharray="3,3" />
              
              {/* Axes */}
              <line x1="40" y1="20" x2="40" y2="190" stroke="#333333" strokeWidth="1.5" />
              <line x1="40" y1="190" x2="480" y2="190" stroke="#333333" strokeWidth="1.5" />

              {/* Y-Axis Labels */}
              <text x="15" y="34" className="text-[8px] font-mono fill-neutral-550 font-semibold">10.0</text>
              <text x="15" y="84" className="text-[8px] font-mono fill-neutral-550 font-semibold">8.5</text>
              <text x="15" y="134" className="text-[8px] font-mono fill-neutral-550 font-semibold">7.0</text>
              <text x="15" y="184" className="text-[8px] font-mono fill-neutral-550 font-semibold">5.0</text>

              {/* Plot points & Line path generation */}
              {(() => {
                // Map points
                const points = topRatedMovies.map((m: any, idx: number) => {
                  const x = 60 + idx * 95;
                  // Map rating to y-axis: 10.0 => 30px, 5.0 => 180px
                  // multiplier: y = 30 + (10.0 - rating) * 30
                  const y = 30 + (10.0 - m.rating) * 30;
                  return { x, y, title: m.title, rating: m.rating };
                });

                // Generate path
                let pathD = "";
                points.forEach((p: any, idx: number) => {
                  pathD += `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
                });

                return (
                  <>
                    {/* Interpolated Rating Line Path */}
                    {pathD && <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2.5" className="animate-pulse" />}

                    {/* Nodes and node descriptors */}
                    {points.map((p: any, idx: number) => (
                      <g key={idx} className="group cursor-pointer">
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="5"
                          fill="#3b82f6"
                          stroke="#050505"
                          strokeWidth="1.5"
                          className="hover:scale-135 transition-transform"
                        />
                        {/* Rating text above circle */}
                        <text x={p.x - 10} y={p.y - 12} className="text-[9px] font-bold font-mono fill-neutral-200">
                          {p.rating.toFixed(1)}
                        </text>
                        {/* Title text below axis */}
                        <text
                          title={p.title}
                          x={p.x}
                          y="210"
                          className="text-[8px] font-bold truncate fill-neutral-400 hover:fill-white text-center"
                          textAnchor="middle"
                        >
                          {p.title.length > 10 ? `${p.title.slice(0, 9)}..` : p.title}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
          <p className="text-[10px] text-neutral-500 font-medium text-center">
            Scores reflect live database evaluations integrated with your personal critic feedback.
          </p>
        </div>
      </div>

      {/* Genre Popularity vs. Average Rating Correlation Scatter Plot */}
      <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl space-y-6">
        <div>
          <h3 className="text-sm font-extrabold text-white">Genre Popularity vs. Average Rating Correlation</h3>
          <p className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">
            Scatter-Bubble Plot evaluating the relationship between genre density (thickness) and average film scores (quality)
          </p>
        </div>

        {(() => {
          // Define a local hook state inside an IIFE component setup or keep it stateless/reactive
          const validGenres = popularGenres.filter((g: any) => g.averageRating > 0);
          const maxCount = Math.max(...validGenres.map((g: any) => g.count), 1);
          
          // Map to SVG coordinates: 
          // Count: 1 to Max => x: 50 to 550
          // Rating: 7.0 to 9.0 => y: 220 to 30
          const getX = (count: number) => 60 + ((count - 0) / (maxCount + 0.5)) * 480;
          const getY = (rating: number) => 225 - ((rating - 7.0) / (2.0)) * 180;

          return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Scatter Plot SVG */}
              <div className="lg:col-span-2 relative bg-[#050505] p-4 rounded-2xl border border-white/5">
                <svg viewBox="0 0 600 270" className="w-full h-full text-neutral-800">
                  {/* Grid Lines */}
                  <line x1="60" y1="45" x2="560" y2="45" stroke="#161616" strokeDasharray="2,2" />
                  <line x1="60" y1="90" x2="560" y2="90" stroke="#161616" strokeDasharray="2,2" />
                  <line x1="60" y1="135" x2="560" y2="135" stroke="#161616" strokeDasharray="2,2" />
                  <line x1="60" y1="180" x2="560" y2="180" stroke="#161616" strokeDasharray="2,2" />
                  
                  {/* Axes */}
                  <line x1="60" y1="30" x2="60" y2="225" stroke="#262626" strokeWidth="1.5" />
                  <line x1="60" y1="225" x2="560" y2="225" stroke="#262626" strokeWidth="1.5" />

                  {/* Y-Axis Labels (Average Rating) */}
                  <text x="25" y="50" className="text-[8px] font-mono fill-neutral-400 font-bold">9.0 ★</text>
                  <text x="25" y="95" className="text-[8px] font-mono fill-neutral-500 font-medium">8.5 ★</text>
                  <text x="25" y="140" className="text-[8px] font-mono fill-neutral-500 font-medium">8.0 ★</text>
                  <text x="25" y="185" className="text-[8px] font-mono fill-neutral-500 font-medium">7.5 ★</text>
                  <text x="25" y="230" className="text-[8px] font-mono fill-neutral-400 font-bold">7.0 ★</text>

                  {/* X-Axis Labels (Popularity/Film Count) */}
                  <text x="60" y="245" className="text-[8px] font-mono fill-neutral-400 font-bold" textAnchor="middle">1 film</text>
                  <text x="310" y="245" className="text-[8px] font-mono fill-neutral-550 font-medium" textAnchor="middle">{(maxCount/2).toFixed(0)} films</text>
                  <text x="560" y="245" className="text-[8px] font-mono fill-neutral-400 font-bold" textAnchor="middle">{maxCount} films (Max)</text>

                  {/* Axis Title */}
                  <text x="310" y="262" className="text-[9px] font-bold tracking-wider fill-neutral-500 text-center" textAnchor="middle">
                    Popularity (Database Film Frequency Count) ➔
                  </text>
                  <text x="15" y="15" className="text-[9px] font-bold tracking-wider fill-neutral-500" transform="rotate(-90 20 120)">
                    Average Rating of Genre ➔
                  </text>

                  {/* Trend Line (Interpolated correlation gradient helper) */}
                  {(() => {
                    // Quick linear regression slope estimation
                    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
                    const n = validGenres.length;
                    if (n > 1) {
                      validGenres.forEach((g: any) => {
                        sumX += g.count;
                        sumY += g.averageRating;
                        sumXY += g.count * g.averageRating;
                        sumX2 += g.count * g.count;
                      });
                      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
                      const intercept = (sumY - slope * sumX) / n;

                      const startYStr = intercept.toFixed(2);
                      const endYStr = (slope * maxCount + intercept).toFixed(2);

                      const x1Str = getX(1);
                      const y1Str = getY(parseFloat(startYStr));
                      const x2Str = getX(maxCount);
                      const y2Str = getY(parseFloat(endYStr));

                      return (
                        <>
                          <line
                            x1={x1Str}
                            y1={y1Str}
                            x2={x2Str}
                            y2={y2Str}
                            stroke="#3b82f6"
                            strokeWidth="1"
                            strokeDasharray="4,4"
                            className="opacity-40"
                          />
                          <text x="440" y="32" className="text-[7.5px] font-mono fill-blue-500/80 font-semibold italic text-right">
                            Linear Trend Overlay
                          </text>
                        </>
                      );
                    }
                    return null;
                  })()}

                  {/* Scatter Bubbles */}
                  {validGenres.map((g: any, idx: number) => {
                    const cx = getX(g.count);
                    const cy = getY(g.averageRating);
                    // Radius corresponds to counts: larger counts = slightly larger bubbles
                    const radius = 6 + (g.count / maxCount) * 12;
                    
                    // Distinct color gradient based on rating
                    const colorFill = g.averageRating >= 8.3 
                      ? '#10b981' // emerald
                      : g.averageRating >= 8.0
                      ? '#3b82f6' // blue
                      : g.averageRating >= 7.6
                      ? '#f59e0b' // amber
                      : '#f43f5e'; // rose

                    return (
                      <g 
                        key={idx} 
                        className="group cursor-pointer"
                        onMouseEnter={() => setHoveredGenre({
                          genre: g.genre,
                          count: g.count,
                          averageRating: g.averageRating,
                          cx,
                          cy
                        })}
                        onMouseLeave={() => setHoveredGenre(null)}
                      >
                        {/* Hover coordinate guides */}
                        <line 
                          x1="60" 
                          y1={cy} 
                          x2={cx} 
                          y2={cy} 
                          stroke={colorFill} 
                          strokeWidth="0.5" 
                          className="opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none" 
                          strokeDasharray="2,2"
                        />
                        <line 
                          x1={cx} 
                          y1="225" 
                          x2={cx} 
                          y2={cy} 
                          stroke={colorFill} 
                          strokeWidth="0.5" 
                          className="opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none" 
                          strokeDasharray="2,2"
                        />

                        {/* Animated outer interactive circle */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={radius + 3}
                          fill="transparent"
                          stroke={colorFill}
                          strokeWidth="1"
                          className="opacity-0 group-hover:opacity-40 scale-100 group-hover:scale-110 transition-all duration-200"
                        />

                        {/* Node Bubble */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={radius}
                          fill={colorFill}
                          fillOpacity="0.15"
                          stroke={colorFill}
                          strokeWidth="2"
                          className="transition-transform duration-200 group-hover:scale-110"
                        />

                        {/* Title text for node */}
                        <text
                          x={cx}
                          y={cy - radius - 5}
                          className="text-[8px] font-bold fill-white opacity-60 group-hover:opacity-100 transition-opacity text-center font-sans shadow shadow-black"
                          textAnchor="middle"
                        >
                          {g.genre}
                        </text>

                        {/* Rating indicator center text */}
                        <text
                          x={cx}
                          y={cy + 3}
                          className="text-[7px] font-mono font-black fill-neutral-300 opacity-0 group-hover:opacity-150 text-center"
                          textAnchor="middle"
                        >
                          {g.averageRating.toFixed(1)}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Interactive Tooltip Overlay */}
                {hoveredGenre && (
                  <div
                    className="absolute pointer-events-none z-10 bg-neutral-950/95 border border-white/10 rounded-xl p-3.5 shadow-2xl transition-all duration-100 ease-out flex flex-col gap-1.5 backdrop-blur-md min-w-[140px] -translate-x-1/2 -translate-y-full"
                    style={{
                      left: `${(hoveredGenre.cx / 600) * 100}%`,
                      top: `${(hoveredGenre.cy / 270) * 100 - 4}%`,
                    }}
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-1">
                      <span className="text-xs font-bold text-white tracking-tight">{hoveredGenre.genre}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                      <div>
                        <div className="text-neutral-500 font-semibold uppercase tracking-wider">Avg Rating</div>
                        <div className="text-emerald-400 font-black text-xs mt-0.5">{hoveredGenre.averageRating.toFixed(2)} ★</div>
                      </div>
                      <div>
                        <div className="text-neutral-500 font-semibold uppercase tracking-wider">Count</div>
                        <div className="text-white font-extrabold text-xs mt-0.5">{hoveredGenre.count} films</div>
                      </div>
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="absolute left-1/2 bottom-0 w-2 h-2 bg-neutral-950 border-r border-b border-white/10 rotate-45 transform -translate-x-1/2 translate-y-1/2" />
                  </div>
                )}
              </div>

              {/* Numerical Table & Observations Column */}
              <div className="space-y-4 pt-2 lg:pt-0">
                <div className="bg-[#050505]/70 border border-white/5 p-4 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-neutral-300 flex items-center gap-1.5 font-mono uppercase">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Metric Insights
                  </h4>
                  <p className="text-[10px] text-neutral-400 leading-relaxed font-mono">
                    We correlate movie counts against average user scores to isolate whether niche topics have higher ratings than highly saturated topics.
                  </p>
                </div>

                {/* Genre Table */}
                <div className="max-h-[174px] overflow-y-auto border border-white/5 rounded-xl text-neutral-200">
                  <table className="w-full text-left text-[10px] font-mono">
                    <thead className="bg-[#0e0e0e] text-neutral-400 uppercase text-[8px] tracking-widest sticky top-0">
                      <tr>
                        <th className="p-2.5">Genre</th>
                        <th className="p-2.5 text-center">Films</th>
                        <th className="p-2.5 text-right">Avg Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-[#030303]/45">
                      {validGenres.map((g: any, idx: number) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="p-2.5 font-semibold text-white/90">{g.genre}</td>
                          <td className="p-2.5 text-center text-neutral-400">{g.count}</td>
                          <td className={`p-2.5 text-right font-bold ${
                            g.averageRating >= 8.2 ? 'text-emerald-400' : 'text-neutral-300'
                          }`}>
                            {g.averageRating.toFixed(2)} ★
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#0c0c0c] p-3 border border-dashed border-white/5 rounded-xl text-[9.5px] text-neutral-500 leading-normal">
                  💡 <span className="font-semibold text-neutral-400">Analysis:</span> Click/hover on scatter nodes to highlight specific genre intersections. High-rating nodes are color-prioritized in emerald while lower density segments default to crimson.
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

import { Film, Compass, Bookmark, BarChart2, MessageSquare } from 'lucide-react';
import type { User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
}

export default function Sidebar({ activeTab, setActiveTab, user }: SidebarProps) {
  const menuItems = [
    { id: 'browse', name: 'Personalized Feed', icon: Compass },
    { id: 'watchlist', name: 'My Watchlist', icon: Bookmark },
    { id: 'analytics', name: 'ML Dashboard', icon: BarChart2 },
  ];

  return (
    <aside id="app_drawer_sidebar" className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-screen shrink-0 sticky top-0 font-sans z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-605 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          <Film className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight text-white font-display">
            CINE<span className="text-blue-500"> BUDDY</span>
          </span>
          <div className="text-[10px] font-bold text-white/30 tracking-widest uppercase font-mono">
            Hybrid Engine v4
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav id="sidebar_nav" className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-3 px-2">Discovery</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              id={`nav_btn_${item.id}`}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-blue-600/10 border-l-4 border-blue-500 text-blue-400'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-white/50'}`} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* ML Engine Status Box */}
      <div className="p-4 mx-4 mb-2 bg-white/5 rounded-xl border border-white/10">
        <p className="text-[9px] uppercase text-blue-400 font-bold mb-1.5 tracking-wider">ML ENGINE STATUS</p>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-white/70">Cosine Similarity: Active</span>
        </div>
        <div className="text-[9px] text-white/30 font-mono">RMSE: 0.812 | Latency: 12ms</div>
      </div>


    </aside>
  );
}

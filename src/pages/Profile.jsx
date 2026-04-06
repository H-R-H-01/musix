import { useAuthStore } from '../store/useAuthStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { Heart, PlaySquare, Settings, UserPlus, Zap, Award, BarChart3, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Profile() {
  const { user } = useAuthStore();
  const { playlists } = useLibraryStore();

  const listeningHours = (user.listeningTime / 3600).toFixed(1);
  const synergyScore = Math.min(100, Math.floor((user.listeningTime / 3600) * 8.5) + 12);
  
  const getSynergyLabel = (score) => {
    if (score > 90) return 'Legendary Lyricist';
    if (score > 75) return 'Harmonic Master';
    if (score > 50) return 'Melody Maven';
    return 'Rising Star';
  };

  return (
    <div className="animated-fade-in max-w-5xl mx-auto h-full flex flex-col gap-8 pb-12">
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-8 pb-8 border-b border-border">
        <div className="w-48 h-48 rounded-2xl shadow-2xl overflow-hidden border-4 border-background bg-secondary flex-shrink-0 rotate-3 hover:rotate-0 transition-transform duration-500">
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover scale-110" />
        </div>
        <div className="flex flex-col gap-2 flex-1 mb-2 text-center md:text-left">
          <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">User Identity</p>
          <h1 className="text-6xl font-black tracking-tighter mb-4 bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">{user.name}</h1>
          <div className="flex flex-wrap justify-center md:justify-start text-sm text-muted-foreground font-bold items-center gap-4">
            <span className={cn("px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest", user.role === 'admin' ? "bg-red-500 text-white" : "bg-primary text-background")}>
               {user.role}
            </span>
            <span className="flex items-center gap-1.5"><PlaySquare size={14}/> {playlists.length} Playlists</span>
            <span className="flex items-center gap-1.5"><Award size={14}/> {getSynergyLabel(synergyScore)}</span>
          </div>
        </div>
        
        <div className="flex gap-3 mb-2">
          <button className="h-11 px-6 rounded-xl bg-foreground text-background font-bold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-foreground/20">
            <UserPlus size={18} /> Follow
          </button>
          <button className="w-11 h-11 rounded-xl border border-border flex items-center justify-center hover:bg-accent hover:border-foreground/20 transition-all">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Synergy Section */}
        <section className="lg:col-span-1 space-y-6">
           <div className="bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Zap size={160} fill="white" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-8">
                   <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                     <Zap size={20} fill="white" />
                   </div>
                   <h3 className="font-black uppercase tracking-widest text-sm">Synergy Score</h3>
                </div>

                <div className="mb-8">
                   <div className="text-7xl font-black tracking-tighter mb-1 leading-none">{synergyScore}</div>
                   <div className="text-xs font-bold uppercase tracking-widest opacity-80">Global Ranking: Top 4.2%</div>
                </div>

                <div className="space-y-4">
                   <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white transition-all duration-1000" style={{ width: `${synergyScore}%` }}></div>
                   </div>
                   <div className="flex justify-between text-[10px] uppercase font-black tracking-widest opacity-70">
                      <span>Rookie</span>
                      <span>Master</span>
                   </div>
                </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="bg-sidebar rounded-2xl border border-border p-5 hover:border-primary/20 transition-all">
                 <div className="text-muted-foreground mb-3"><Clock size={20}/></div>
                 <div className="text-2xl font-black">{listeningHours}h</div>
                 <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Listening Time</div>
              </div>
              <div className="bg-sidebar rounded-2xl border border-border p-5 hover:border-primary/20 transition-all">
                 <div className="text-muted-foreground mb-3"><BarChart3 size={20}/></div>
                 <div className="text-2xl font-black">2.4k</div>
                 <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Total Streams</div>
              </div>
           </div>
        </section>

        {/* Playlists Section */}
        <section className="lg:col-span-2">
          <h2 className="text-2xl font-black tracking-tight mb-6 flex items-center gap-3">
             <PlaySquare className="text-primary" />
             Library & Playlists
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {playlists.map(playlist => (
              <Link key={playlist.id} to={`/playlist/${playlist.id}`} className="flex items-center gap-4 p-4 bg-sidebar hover:bg-accent/50 rounded-2xl border border-border group transition-all">
                <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg bg-accent group-hover:scale-105 transition-all flex-shrink-0">
                  {playlist.id === 'liked-music' ? (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-800 flex items-center justify-center">
                      <Heart size={32} className="text-white" fill="currentColor" />
                    </div>
                  ) : (
                    <img src={playlist.cover_url} alt={playlist.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold truncate mb-1 text-lg group-hover:text-primary transition-colors">{playlist.name}</h4>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">{playlist.songs.length} Tracks</p>
                   <div className="flex gap-1.5 overflow-hidden">
                      {playlist.songs.slice(0, 3).map((s, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border border-background overflow-hidden -ml-2 first:ml-0 bg-accent">
                          <img src={s.cover_url} className="w-full h-full object-cover opacity-50" />
                        </div>
                      ))}
                      {playlist.songs.length > 3 && <div className="text-[10px] font-bold text-muted-foreground self-center ml-1">+{playlist.songs.length - 3} more</div>}
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}


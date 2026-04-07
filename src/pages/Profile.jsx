import { useAuthStore } from '../store/useAuthStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { Heart, PlaySquare, Settings, UserPlus, Zap, Award, BarChart3, Clock, Users, Plus, Share2, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useState } from 'react';

export default function Profile() {
  const { user, addConnection, incrementSynergy } = useAuthStore();
  const { playlists } = useLibraryStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newConn, setNewConn] = useState({ name: '', relation: 'Friend' });

  const listeningHours = (user.listeningTime / 3600).toFixed(1);
  const synergyScore = Math.min(100, Math.floor((user.listeningTime / 3600) * 8.5) + 12);
  
  const getSynergyLabel = (score) => {
    if (score > 90) return 'Legendary Lyricist';
    if (score > 75) return 'Harmonic Master';
    if (score > 50) return 'Melody Maven';
    return 'Rising Star';
  };

  const handleAddConn = (e) => {
    e.preventDefault();
    if (!newConn.name) return;
    addConnection({
      id: Date.now().toString(),
      name: newConn.name,
      relation: newConn.relation,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newConn.name)}&background=random`
    });
    setNewConn({ name: '', relation: 'Friend' });
    setShowAddModal(false);
  };

  return (
    <div className="animated-fade-in max-w-6xl mx-auto h-full flex flex-col gap-10 pb-20">
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-10 pb-10 border-b border-border">
        <div className="w-56 h-56 rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-background bg-secondary flex-shrink-0 -rotate-2 hover:rotate-0 transition-all duration-700 hover:shadow-primary/20">
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700" />
        </div>
        <div className="flex flex-col gap-3 flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
             <span className="px-3 py-1 rounded-full bg-primary text-background text-[10px] font-black uppercase tracking-[0.2em]">{user.role}</span>
             <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-[10px] font-black uppercase tracking-[0.2em]">Verified Hub</span>
          </div>
          <h1 className="text-7xl font-black tracking-tighter leading-none mb-2 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">{user.name}</h1>
          <div className="flex flex-wrap justify-center md:justify-start text-xs text-muted-foreground font-black items-center gap-6 uppercase tracking-widest">
            <span className="flex items-center gap-2"><PlaySquare size={16} className="text-primary"/> {playlists.length} Collections</span>
            <span className="flex items-center gap-2"><Users size={16} className="text-primary"/> {user.connections.length} Connections</span>
            <span className="flex items-center gap-2"><Award size={16} className="text-primary"/> {getSynergyLabel(synergyScore)}</span>
          </div>
        </div>
        
        <div className="flex gap-4 mb-4">
          <button className="h-14 px-8 rounded-2xl bg-foreground text-background font-black text-sm flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-foreground/20">
            <UserPlus size={20} /> Edit Hub
          </button>
          <button className="w-14 h-14 rounded-2xl border-2 border-border flex items-center justify-center hover:bg-accent hover:border-primary/20 transition-all active:scale-90">
            <Settings size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Stats & Synergy */}
        <div className="lg:col-span-4 space-y-10">
           {/* Global Synergy */}
           <div className="bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group border-4 border-white/10">
              <div className="absolute -right-8 -top-8 opacity-10 group-hover:scale-110 transition-transform duration-1000 rotate-12">
                <Zap size={240} fill="white" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                   <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-lg">
                     <Zap size={24} fill="white" />
                   </div>
                   <h3 className="font-black uppercase tracking-[0.2em] text-xs">Total Synergy</h3>
                </div>

                <div className="mb-10">
                   <div className="text-8xl font-black tracking-tighter mb-2 leading-none flex items-baseline">
                      {synergyScore}
                      <span className="text-lg opacity-50 ml-2 tracking-widest italic">pts</span>
                   </div>
                   <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest">
                      Ranking: Top 0.2%
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/10 p-0.5">
                      <div className="h-full bg-gradient-to-r from-white/60 to-white rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(255,255,255,0.4)]" style={{ width: `${synergyScore}%` }}></div>
                   </div>
                   <div className="flex justify-between text-[10px] uppercase font-black tracking-widest opacity-60">
                      <span>Beginner</span>
                      <span>Audio Oracle</span>
                   </div>
                </div>
              </div>
           </div>

           {/* Quick Stats Grid */}
           <div className="grid grid-cols-2 gap-6">
              <div className="bg-sidebar rounded-[2rem] border border-border p-8 hover:border-primary/20 transition-all group shadow-sm">
                 <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform"><Clock size={24}/></div>
                 <div className="text-3xl font-black mb-1 leading-none">{listeningHours}h</div>
                 <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em]">Live Tracking</div>
              </div>
              <div className="bg-sidebar rounded-[2rem] border border-border p-8 hover:border-primary/20 transition-all group shadow-sm">
                 <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform"><BarChart3 size={24}/></div>
                 <div className="text-3xl font-black mb-1 leading-none">2.4k</div>
                 <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em]">Total Pulse</div>
              </div>
           </div>
        </div>

        {/* Center/Right Column: Connections & Playlists */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Family & Friends Synergy Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                   <Users size={24} />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black tracking-tight">Circle Synergy</h2>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Shared music earns points</p>
                 </div>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center hover:scale-110 transition-all shadow-xl shadow-foreground/10"
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {user.connections.map((conn) => (
                 <div key={conn.id} className="bg-sidebar rounded-3xl p-6 border border-border flex flex-col gap-6 group hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-background shadow-lg transition-transform group-hover:scale-105">
                         <img src={conn.avatar} alt={conn.name} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-black text-lg truncate group-hover:text-primary transition-colors">{conn.name}</h4>
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-accent rounded text-muted-foreground">{conn.relation}</span>
                       </div>
                       <button className="text-muted-foreground hover:text-foreground p-2">
                          <MoreHorizontal size={20} />
                       </button>
                    </div>

                    <div className="bg-background/50 rounded-2xl p-4 border border-border/50">
                       <div className="flex justify-between items-end mb-3">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Circle Rank</span>
                             <span className="text-xl font-black text-primary flex items-center gap-2">
                                <Zap size={16} fill="currentColor" /> {conn.synergy} <span className="text-[10px] opacity-40 italic">pts</span>
                             </span>
                          </div>
                          <button 
                            onClick={() => {
                              incrementSynergy(conn.id, 50);
                              alert(`Music loop shared with ${conn.name}! +50 Synergy Points earned.`);
                            }}
                            className="h-8 px-4 rounded-xl bg-accent hover:bg-primary hover:text-background text-[10px] font-black uppercase tracking-widest transition-all mb-1 flex items-center gap-2"
                          >
                             <Share2 size={12} /> Share Loop
                          </button>
                       </div>
                       <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-1000 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                            style={{ width: `${Math.min(100, conn.synergy / 20)}%` }}
                          ></div>
                       </div>
                    </div>
                 </div>
               ))}

               {user.connections.length === 0 && (
                 <div className="md:col-span-2 py-20 bg-sidebar/30 border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-center px-10">
                    <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-muted-foreground/30 mb-6">
                       <Users size={40} />
                    </div>
                    <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Build your Synergy Circle</h3>
                    <p className="text-muted-foreground text-sm max-w-xs font-medium">Add friends or family to start earning shared synergy points through music sharing.</p>
                 </div>
               )}
            </div>
          </section>

          {/* Library & Playlists */}
          <section>
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                 <PlaySquare size={24} />
               </div>
               <div>
                  <h2 className="text-3xl font-black tracking-tight">Audio Collections</h2>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Your curated sonic landscapes</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {playlists.map(playlist => (
                <Link key={playlist.id} to={`/playlist/${playlist.id}`} className="flex items-center gap-6 p-6 bg-sidebar hover:bg-accent/40 rounded-[2.5rem] border border-border group transition-all relative overflow-hidden">
                  <div className="w-32 h-32 rounded-[2rem] overflow-hidden shadow-2xl bg-accent group-hover:scale-105 transition-all flex-shrink-0 group-hover:-rotate-3 duration-500">
                    {playlist.id === 'liked-music' ? (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-700 to-pink-600 flex items-center justify-center">
                        <Heart size={48} className="text-white" fill="white" />
                      </div>
                    ) : (
                      <img src={playlist.cover_url} alt={playlist.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-2">
                    <h4 className="font-black truncate mb-2 text-2xl group-hover:text-primary transition-colors tracking-tighter">{playlist.name}</h4>
                    <div className="flex items-center gap-2 mb-4">
                       <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded leading-none">{playlist.songs.length} Tracks</span>
                       <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Sonic Era</span>
                    </div>
                    <div className="flex gap-2 isolate">
                        {playlist.songs.slice(0, 3).map((s, i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-background overflow-hidden -ml-3 first:ml-0 shadow-lg" style={{ zIndex: 10 - i }}>
                            <img src={s.cover_url} className="w-full h-full object-cover" />
                          </div>
                        ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Add Connection Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-3xl animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-sidebar border border-border rounded-[3rem] p-10 shadow-[0_0_80px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-10 duration-500">
              <h3 className="text-3xl font-black mb-1 uppercase tracking-tighter">Expand Circle</h3>
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mb-8">Build your shared synergy</p>
              
              <form onSubmit={handleAddConn} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2 px-1">Identity Name</label>
                    <input 
                      required
                      type="text" 
                      value={newConn.name}
                      onChange={(e) => setNewConn(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full h-14 bg-background border border-border rounded-2xl px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all uppercase tracking-widest text-sm"
                      placeholder="e.g. Alex Rivera"
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2 px-1">Relationship</label>
                    <select 
                      value={newConn.relation}
                      onChange={(e) => setNewConn(prev => ({ ...prev, relation: e.target.value }))}
                      className="w-full h-14 bg-background border border-border rounded-2xl px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all uppercase tracking-widest text-sm"
                    >
                       <option value="Friend">Friend</option>
                       <option value="Family">Family</option>
                       <option value="Partner">Partner</option>
                       <option value="Audio Bestie">Audio Bestie</option>
                    </select>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 h-14 rounded-2xl bg-accent font-black uppercase tracking-widest text-xs hover:bg-accent/80 transition-all"
                    >
                       Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 h-14 rounded-2xl bg-primary text-background font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-primary/20"
                    >
                       Confirm Hub
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}



import { useAuthStore } from '../store/useAuthStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { useThemeStore } from '../store/useThemeStore';
import { 
  Heart, PlaySquare, Settings as SettingsIcon, UserPlus, Zap, 
  Award, BarChart3, Clock, Users, Plus, Share2, MoreHorizontal,
  Mail, User as UserIcon, Shield, Palette, LogOut, Check, X,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useState, useRef } from 'react';

export default function Profile() {
  const { user, addConnection, incrementSynergy, updateProfile, removeConnection } = useAuthStore();
  const { playlists } = useLibraryStore();
  const { theme, toggleTheme } = useThemeStore();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'connections' | 'settings'
  const [showAddModal, setShowAddModal] = useState(false);
  const [newConn, setNewConn] = useState({ name: '', relation: 'Friend' });
  
  // Settings State
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user.name, email: user.email });
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    if (editMode) {
      setProfileForm({ name: user.name, email: user.email });
    }
  }, [editMode, user]);

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

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    setTimeout(() => {
      updateProfile(profileForm);
      setSaveStatus('success');
      setEditMode(false);
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  return (
    <div className="animated-fade-in max-w-6xl mx-auto h-full flex flex-col gap-10 pb-24">
      
      {/* Profile Header Card */}
      <div className="bg-sidebar rounded-[3rem] p-10 border border-border flex flex-col md:flex-row items-center md:items-end gap-10 relative overflow-hidden group shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="w-56 h-56 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-background bg-secondary flex-shrink-0 relative group/avatar z-10 transition-transform hover:scale-[1.02] duration-500">
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
             <Palette className="text-white" size={32} />
          </div>
        </div>
        
        <div className="flex flex-col gap-3 flex-1 text-center md:text-left relative z-10">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
             <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg", user.role === 'admin' ? "bg-red-500 text-white" : "bg-primary text-background")}>
                {user.role} Hub
             </span>
             <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-[10px] font-black uppercase tracking-[0.2em]">Verified Hub</span>
          </div>
          <h1 className="text-7xl font-black tracking-tighter leading-none mb-2 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent italic select-none">{user.name}</h1>
          <div className="flex flex-wrap justify-center md:justify-start text-xs text-muted-foreground font-black items-center gap-6 uppercase tracking-[0.1em]">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background border border-border/50"><PlaySquare size={16} className="text-primary"/> {playlists.length} Audio Sets</span>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background border border-border/50"><Users size={16} className="text-primary"/> {user.connections.length} Connections</span>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background border border-border/50"><Award size={16} className="text-primary"/> {getSynergyLabel(synergyScore)}</span>
          </div>
        </div>
        
        <div className="flex gap-4 mb-4 relative z-10">
          <button 
            onClick={() => setActiveTab('settings')}
            className="h-14 px-8 rounded-[1.5rem] bg-foreground text-background font-black text-xs flex items-center gap-3 hover:scale-[1.05] active:scale-95 transition-all shadow-2xl shadow-foreground/20 uppercase tracking-widest"
          >
            <SettingsIcon size={20} /> Manage Account
          </button>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex items-center justify-center md:justify-start gap-4 p-2 bg-sidebar h-fit w-fit rounded-[1.5rem] border border-border/50 mx-auto md:mx-0 select-none">
        {[
          { id: 'overview', icon: <BarChart3 size={18}/>, label: 'Overview' },
          { id: 'connections', icon: <Users size={18}/>, label: 'Connections' },
          { id: 'settings', icon: <SettingsIcon size={18}/>, label: 'Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-6 py-3 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-foreground text-background shadow-xl" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10">
        
        {/* Tab Content: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="lg:col-span-4 space-y-10">
               {/* Global Synergy */}
               <div className="bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group border-4 border-white/10 h-full min-h-[400px]">
                  <div className="absolute -right-8 -top-8 opacity-10 group-hover:scale-110 transition-transform duration-1000 rotate-12">
                    <Zap size={240} fill="white" />
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-10">
                         <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-lg">
                           <Zap size={24} fill="white" />
                         </div>
                         <h3 className="font-black uppercase tracking-[0.2em] text-xs">Total Synergy</h3>
                      </div>
                      <div className="mb-10">
                         <div className="text-9xl font-black tracking-tighter mb-2 leading-none flex items-baseline">
                            {synergyScore}
                            <span className="text-lg opacity-50 ml-2 tracking-widest italic font-bold">PTS</span>
                         </div>
                         <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest">
                            Ranking: Top 0.2%
                         </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                       <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/10 p-0.5">
                          <div className="h-full bg-gradient-to-r from-white/60 to-white rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(255,255,255,0.4)]" style={{ width: `${synergyScore}%` }}></div>
                       </div>
                       <div className="flex justify-between text-[10px] uppercase font-black tracking-widest opacity-60">
                          <span>Melody Novice</span>
                          <span>Audio Oracle</span>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-8 space-y-12">
               {/* Pulse Stats */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-sidebar rounded-[2.5rem] border border-border p-8 hover:border-primary/20 transition-all group shadow-sm">
                     <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-all"><Clock size={28}/></div>
                     <div className="text-4xl font-black mb-1 tracking-tighter italic">{listeningHours}h</div>
                     <div className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">Listening History</div>
                  </div>
                  <div className="bg-sidebar rounded-[2.5rem] border border-border p-8 hover:border-primary/20 transition-all group shadow-sm">
                     <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-all"><BarChart3 size={28}/></div>
                     <div className="text-4xl font-black mb-1 tracking-tighter italic">2,482</div>
                     <div className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">Platform Streams</div>
                  </div>
                  <div className="bg-sidebar rounded-[2.5rem] border border-border p-8 hover:border-primary/20 transition-all group shadow-sm sm:col-span-2 lg:col-span-1">
                     <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-all"><Award size={28}/></div>
                     <div className="text-4xl font-black mb-1 tracking-tighter italic italic flex items-center gap-2">
                        {Math.floor(synergyScore / 10)} 
                        <span className="text-sm italic opacity-30 tracking-widest font-black uppercase">Level</span>
                     </div>
                     <div className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">Experience Rank</div>
                  </div>
               </div>

               {/* Playlists Preview */}
               <section>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                       <PlaySquare size={24} />
                     </div>
                     <h2 className="text-3xl font-black tracking-tight italic">Top Collections</h2>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {playlists.map(playlist => (
                    <Link key={playlist.id} to={`/playlist/${playlist.id}`} className="flex items-center gap-6 p-6 bg-sidebar hover:bg-accent/40 rounded-[3rem] border border-border group transition-all relative overflow-hidden">
                      <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden shadow-2xl bg-accent group-hover:scale-105 transition-all flex-shrink-0 group-hover:-rotate-6 duration-500">
                        {playlist.id === 'liked-music' ? (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-700 to-pink-600 flex items-center justify-center">
                            <Heart size={48} className="text-white" fill="white" />
                          </div>
                        ) : (
                          <img src={playlist.cover_url} alt={playlist.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 py-2">
                        <h4 className="font-black truncate mb-2 text-2xl group-hover:text-primary transition-colors tracking-tighter italic">{playlist.name}</h4>
                        <div className="flex items-center gap-2 mb-4">
                           <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded leading-none">{playlist.songs.length} Tracks</span>
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
        )}

        {/* Tab Content: CONNECTIONS */}
        {activeTab === 'connections' && (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 shadow-xl">
                   <Users size={28} />
                 </div>
                 <div>
                    <h2 className="text-4xl font-black tracking-tight italic">Family & Circles</h2>
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">Manage shared synergy hubs</p>
                 </div>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="h-14 px-8 rounded-2xl bg-foreground text-background font-black text-xs flex items-center gap-4 hover:scale-110 active:scale-90 transition-all shadow-2xl shadow-foreground/20 uppercase tracking-widest"
              >
                <Plus size={24} /> New Hub
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {user.connections.map((conn) => (
                 <div key={conn.id} className="bg-sidebar rounded-[2.5rem] p-8 border border-border flex flex-col gap-8 group hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                    <div className="flex items-center gap-6 relative z-10">
                       <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-background shadow-2xl group-hover:scale-110 transition-transform duration-500 rotate-2 group-hover:rotate-0">
                         <img src={conn.avatar} alt={conn.name} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-black text-2xl truncate group-hover:text-primary transition-colors tracking-tighter italic leading-none mb-2">{conn.name}</h4>
                          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-accent rounded-full text-muted-foreground border border-border/50">{conn.relation}</span>
                       </div>
                    </div>

                    <div className="bg-background/80 backdrop-blur-md rounded-3xl p-6 border border-border/50 relative z-10">
                       <div className="flex justify-between items-end mb-4">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Circle Resonance</span>
                             <span className="text-3xl font-black text-primary flex items-center gap-3">
                                <Zap size={20} fill="currentColor" /> {conn.synergy} <span className="text-xs opacity-40 italic tracking-widest">PTS</span>
                             </span>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button 
                            onClick={() => { incrementSynergy(conn.id, 50); }}
                            className="flex-1 h-10 rounded-xl bg-accent hover:bg-primary hover:text-background text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                          >
                             <Share2 size={14} /> Loop
                          </button>
                          <button 
                            onClick={() => removeConnection(conn.id)}
                            className="w-10 h-10 rounded-xl bg-accent hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
               
               {user.connections.length === 0 && (
                 <div className="lg:col-span-3 py-32 bg-sidebar/30 border-2 border-dashed border-border rounded-[4rem] flex flex-col items-center justify-center text-center px-10">
                    <Users className="text-muted-foreground/20 mb-8" size={80} />
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">No Synergy Hubs</h3>
                    <p className="text-muted-foreground font-bold max-w-sm text-sm uppercase tracking-widest leading-loose">Expand your sensory network by inviting friends and family to your circle.</p>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Tab Content: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
               {/* Profile Edit Section */}
               <section className="bg-sidebar rounded-[3rem] p-10 border border-border shadow-xl">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <UserIcon size={24} />
                      </div>
                      <h2 className="text-3xl font-black tracking-tight italic">Hub Credentials</h2>
                    </div>
                    {!editMode ? (
                      <button 
                        onClick={() => setEditMode(true)}
                        className="h-11 px-6 rounded-xl bg-accent text-accent-foreground text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
                      >
                        Edit Information
                      </button>
                    ) : (
                      <div className="flex gap-2">
                         <button onClick={() => setEditMode(false)} className="w-11 h-11 rounded-xl bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center transition-all"><X size={20}/></button>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Display Hub Name</label>
                           <div className="relative group">
                              <UserIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                              <input 
                                disabled={!editMode}
                                type="text"
                                value={profileForm.name}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full h-14 bg-background border border-border rounded-2xl pl-12 pr-6 font-black focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-50 text-sm tracking-widest"
                              />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Audio Registry Email</label>
                           <div className="relative group">
                              <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                              <input 
                                disabled={!editMode}
                                type="email"
                                value={profileForm.email}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full h-14 bg-background border border-border rounded-2xl pl-12 pr-6 font-black focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-50 text-sm tracking-widest"
                              />
                           </div>
                        </div>
                     </div>
                     
                     {editMode && (
                        <div className="pt-4 animate-in fade-in zoom-in duration-300">
                           <button 
                            type="submit"
                            disabled={saveStatus === 'saving'}
                            className={cn(
                              "h-14 w-full rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3",
                              saveStatus === 'success' ? "bg-green-500 text-white" : "bg-primary text-background shadow-xl hover:scale-[1.02] active:scale-95"
                            )}
                           >
                              {saveStatus === 'saving' ? 'Syncing...' : saveStatus === 'success' ? <><Check size={20}/> Hub Updated</> : 'Confirm Changes'}
                           </button>
                        </div>
                     )}
                  </form>
               </section>

               {/* Appearance Section */}
               <section className="bg-sidebar rounded-[3rem] p-10 border border-border shadow-xl">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Palette size={24} />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight italic">Visual Frequency</h2>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6">
                    <button 
                      onClick={() => theme === 'light' && toggleTheme()}
                      className={cn(
                        "flex-1 p-8 rounded-[2rem] border-2 transition-all group relative overflow-hidden",
                        theme === 'dark' ? "border-primary bg-primary/5 shadow-2xl" : "border-border bg-background hover:border-primary/20"
                      )}
                    >
                       <div className="relative z-10 flex flex-col items-center gap-4">
                          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg", theme === 'dark' ? "bg-primary text-background" : "bg-accent text-muted-foreground")}>
                             <Palette size={24} />
                          </div>
                          <div className="text-center">
                             <div className="font-black uppercase tracking-widest text-sm mb-1">Night Mode</div>
                             <div className="text-[10px] font-bold text-muted-foreground uppercase">Low intensity audio hub</div>
                          </div>
                       </div>
                       {theme === 'dark' && <div className="absolute top-4 right-4 text-primary"><Check size={20}/></div>}
                    </button>

                    <button 
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className={cn(
                        "flex-1 p-8 rounded-[2rem] border-2 transition-all group relative overflow-hidden",
                        theme === 'light' ? "border-primary bg-primary/5 shadow-2xl" : "border-border bg-background hover:border-primary/20"
                      )}
                    >
                       <div className="relative z-10 flex flex-col items-center gap-4">
                          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg", theme === 'light' ? "bg-primary text-background" : "bg-accent text-muted-foreground")}>
                             <Palette size={24} />
                          </div>
                          <div className="text-center">
                             <div className="font-black uppercase tracking-widest text-sm mb-1">Day Mode</div>
                             <div className="text-[10px] font-bold text-muted-foreground uppercase">High clarity visualization</div>
                          </div>
                       </div>
                       {theme === 'light' && <div className="absolute top-4 right-4 text-primary"><Check size={20}/></div>}
                    </button>
                  </div>
               </section>
            </div>

            <div className="lg:col-span-4 space-y-10">
               {/* Security & System */}
               <section className="bg-sidebar rounded-[3rem] p-10 border border-border shadow-xl h-fit">
                  <div className="flex items-center gap-4 mb-10">
                     <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                      <Shield size={20} />
                     </div>
                     <h2 className="text-xl font-black tracking-tight italic">System Ops</h2>
                  </div>

                  <div className="space-y-4">
                    <button className="w-full h-14 rounded-2xl border border-border flex items-center justify-between px-6 hover:bg-accent hover:border-primary/20 transition-all font-black text-[10px] uppercase tracking-widest">
                       <span>Two-Factor Sync</span>
                       <span className="text-muted-foreground">Inactive</span>
                    </button>
                    <button className="w-full h-14 rounded-2xl border border-border flex items-center justify-between px-6 hover:bg-accent hover:border-primary/20 transition-all font-black text-[10px] uppercase tracking-widest">
                       <span>Data Extraction</span>
                       <span className="text-muted-foreground">Download</span>
                    </button>
                    <div className="pt-6">
                       <button className="w-full h-16 rounded-[1.5rem] bg-red-500 text-white font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 shadow-2xl shadow-red-500/30 hover:scale-[1.05] active:scale-95 transition-all">
                          <LogOut size={20} /> Terminate Session
                       </button>
                    </div>
                  </div>
               </section>
            </div>
          </div>
        )}

      </div>

      {/* Circle Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-3xl animate-in fade-in duration-500">
           <div className="w-full max-w-md bg-sidebar border border-border rounded-[4rem] p-12 shadow-[0_0_120px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom-20 duration-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              
              <div className="relative z-10 text-center mb-10">
                 <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6 shadow-xl border border-primary/10">
                    <Users size={32} />
                 </div>
                 <h3 className="text-4xl font-black mb-2 uppercase tracking-tighter italic">Sonic Expansion</h3>
                 <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">Integrate social synergy hubs</p>
              </div>
              
              <form onSubmit={handleAddConn} className="space-y-8 relative z-10">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block px-1">Identity Blueprint (Name)</label>
                    <input 
                      required
                      type="text" 
                      value={newConn.name}
                      onChange={(e) => setNewConn(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full h-16 bg-background border border-border rounded-[1.5rem] px-8 font-black focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all uppercase tracking-widest text-sm"
                      placeholder="e.g. Alex Rivera"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block px-1">Resonance Type (Relationship)</label>
                    <select 
                      value={newConn.relation}
                      onChange={(e) => setNewConn(prev => ({ ...prev, relation: e.target.value }))}
                      className="w-full h-16 bg-background border border-border rounded-[1.5rem] px-8 font-black focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all uppercase tracking-widest text-sm appearance-none cursor-pointer"
                    >
                       <option value="Friend">Sonic Friend</option>
                       <option value="Family">Family Matrix</option>
                       <option value="Partner">Life Partner</option>
                       <option value="Audio Bestie">Audio Oracle</option>
                    </select>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 h-16 rounded-[1.5rem] bg-accent font-black uppercase tracking-widest text-[10px] hover:bg-accent/70 transition-all border border-border/50"
                    >
                       Abort
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 h-16 rounded-[1.5rem] bg-primary text-background font-black uppercase tracking-widest text-[10px] hover:scale-[1.05] transition-all shadow-2xl shadow-primary/20 border border-primary/20"
                    >
                       Establish Hub
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}




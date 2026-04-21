import { useState, useRef } from 'react';
import { useLibraryStore } from '../store/useLibraryStore';
import { useAuthStore } from '../store/useAuthStore';
import { UploadCloud, CheckCircle2, Layout, Plus, Trash2, Music, Users, Play, Activity, X, FileMusic, Image as ImageIcon, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { homeSections, updateHomeSections } = useLibraryStore();
  
  const [uploadStatus, setUploadStatus] = useState(''); // '', 'uploading', 'success', 'error'
  const [songData, setSongData] = useState({ title: '', artist: '', genre: 'Pop', lyrics: '' });
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const audioInputRef = useRef(null);

  if (user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] gap-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 flex items-center justify-center text-red-500 shadow-xl shadow-red-500/5 border border-red-500/20">
          <ShieldAlert size={40} />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-black italic tracking-tight">Access Denied</h2>
          <p className="text-muted-foreground font-medium mt-2">Administrative privileges required for this frequency.</p>
        </div>
      </div>
    );
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (files[0].type.startsWith('audio/')) {
        setAudioFile(files[0]);
        if (!songData.title) {
           setSongData(prev => ({ ...prev, title: files[0].name.split('.')[0] }));
        }
      }
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!audioFile) return;

    setUploadStatus('uploading');
    // Mock upload simulation
    setTimeout(() => {
      setUploadStatus('success');
      setSongData({ title: '', artist: '', genre: 'Pop', lyrics: '' });

      setAudioFile(null);
      setCoverFile(null);
      setTimeout(() => setUploadStatus(''), 4000);
    }, 2000);
  };

  const handleAddSection = () => {
    updateHomeSections([
      ...homeSections,
      { id: Date.now().toString(), title: 'New Collection', type: 'list' }
    ]);
  };

  const handleRemoveSection = (id) => {
    updateHomeSections(homeSections.filter(s => s.id !== id));
  };

  const handleUpdateSectionTitle = (id, newTitle) => {
    updateHomeSections(homeSections.map(s => 
      s.id === id ? { ...s, title: newTitle } : s
    ));
  };

  const stats = [
    { label: 'Total Songs', value: '1,284', icon: <Music size={20} />, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Users', value: '45.2k', icon: <Users size={20} />, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Active Streams', value: '12.8k', icon: <Activity size={20} />, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Daily Plays', value: '256k', icon: <Play size={20} />, color: 'text-orange-500', bg: 'bg-orange-500/10' }
  ];

  return (
    <div className="animated-fade-in space-y-12 pb-20">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black tracking-tight italic text-gradient">Control Center</h1>
        <p className="text-muted-foreground text-lg font-medium">Synchronize the global library and system variables.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass dark:glass-dark p-8 rounded-[2.5rem] border border-border/30 flex items-center gap-6 hover:scale-[1.05] transition-all cursor-default shadow-premium">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg", stat.bg, stat.color)}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black italic tracking-tighter tabular-nums">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Simplified Upload Process */}
        <section className="lg:col-span-2 glass dark:glass-dark h-fit rounded-[3rem] border border-border/30 overflow-hidden shadow-premium">
          <div className="p-8 border-b border-border/10 flex items-center justify-between bg-primary/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                <UploadCloud size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black italic tracking-tight">Signal Ingest</h2>
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">Upload new audio frequencies to the grid</p>
              </div>
            </div>
            {audioFile && (
              <div className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-green-500/20">
                <CheckCircle2 size={12} /> Ready for Ingest
              </div>
            )}
          </div>
          
          <form onSubmit={handleUpload} className="p-10 space-y-10">
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => audioInputRef.current?.click()}
              className={cn(
                "group relative border-2 border-dashed rounded-[2.5rem] p-16 flex flex-col items-center justify-center gap-6 transition-all duration-500 cursor-pointer overflow-hidden isolate",
                isDragging ? "bg-primary/10 border-primary scale-[1.02] shadow-2xl shadow-primary/10" : "border-border/50 hover:border-primary/40 hover:bg-secondary/20",
                audioFile ? "border-green-500/50 bg-green-500/5" : ""
              )}
            >
              {/* Background gradient effect on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              
              <input 
                type="file" 
                ref={audioInputRef}
                className="hidden" 
                accept="audio/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setAudioFile(e.target.files[0]);
                    if (!songData.title) setSongData(prev => ({ ...prev, title: e.target.files[0].name.split('.')[0] }));
                  }
                }}
              />
              
              <div className={cn(
                "w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-xl",
                audioFile ? "bg-green-500 text-white rotate-0" : "bg-secondary text-muted-foreground group-hover:scale-110 group-hover:bg-primary group-hover:text-white"
              )}>
                {audioFile ? <CheckCircle2 size={40} /> : <FileMusic size={40} />}
              </div>
              <div className="text-center max-w-sm">
                <h3 className="font-black text-2xl italic tracking-tight">{audioFile ? "Signal Validated" : "Ingest New Frequency"}</h3>
                <p className="text-sm font-medium text-muted-foreground mt-2 leading-relaxed">
                  {audioFile ? audioFile.name : "Drag and drop your audio master (MP3, WAV, FLAC) up to 25MB."}
                </p>
              </div>

              {audioFile && (
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setAudioFile(null); }}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 transition-all hover:scale-110 shadow-lg"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2">Manifest Title</label>
                  <div className="relative">
                    <Music size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                    <input 
                      required
                      type="text" 
                      value={songData.title}
                      onChange={(e) => setSongData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full h-14 bg-secondary/30 rounded-2xl pl-12 pr-6 font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 border border-border/20 transition-all text-sm"
                      placeholder="e.g. Skyline Drift"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2">Artist Identification</label>
                  <div className="relative">
                    <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                    <input 
                      required
                      type="text" 
                      value={songData.artist}
                      onChange={(e) => setSongData(prev => ({ ...prev, artist: e.target.value }))}
                      className="w-full h-14 bg-secondary/30 rounded-2xl pl-12 pr-6 font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 border border-border/20 transition-all text-sm"
                      placeholder="e.g. Neon Horizon"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2">Visual Mapping (Cover Art)</label>
                <div className="h-[136px] border-2 border-dashed border-border/30 rounded-[1.56rem] bg-secondary/20 flex flex-col items-center justify-center gap-3 group/img relative overflow-hidden cursor-pointer hover:border-primary transition-all duration-300">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" />
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground group-hover/img:bg-primary group-hover/img:text-white transition-all shadow-md">
                    <ImageIcon size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Capture Texture (JPG/PNG)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2">Lyric Matrix (Optional)</label>
              <textarea 
                value={songData.lyrics}
                onChange={(e) => setSongData(prev => ({ ...prev, lyrics: e.target.value }))}
                className="w-full h-32 bg-secondary/30 rounded-2xl p-6 font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 border border-border/20 transition-all text-sm resize-none"
                placeholder="Synchronize lyrics for karaoke overlay..."
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={uploadStatus === 'uploading' || !audioFile}
                className={cn(
                  "w-full h-16 rounded-[1.5rem] font-black uppercase tracking-[0.25em] text-xs transition-all duration-500 flex items-center justify-center gap-4 shadow-xl",
                  "bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:grayscale",
                  uploadStatus === 'success' ? "bg-green-500 shadow-green-500/20" : ""
                )}
              >
                {uploadStatus === 'uploading' ? (
                  <>
                    <div className="w-6 h-6 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div>
                    Broadcasting Signal...
                  </>
                ) : uploadStatus === 'success' ? (
                  <>
                    <CheckCircle2 size={24} />
                    Synchronization Complete
                  </>
                ) : (
                  <>
                    <UploadCloud size={24} />
                    Establish Grid Frequency
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Section Management */}
        <section className="glass dark:glass-dark rounded-[3rem] border border-border/30 flex flex-col overflow-hidden shadow-premium h-fit sticky top-6">
          <div className="p-8 border-b border-border/10 flex items-center justify-between bg-primary/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-lg">
                <Layout size={24} />
              </div>
              <h2 className="text-2xl font-black italic tracking-tight">Grid Layout</h2>
            </div>
            <button 
              onClick={handleAddSection}
              className="w-10 h-10 rounded-xl bg-background border border-border/50 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-90 shadow-md"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <div className="p-8 space-y-5 max-h-[700px] overflow-y-auto no-scrollbar">
            {homeSections.map((section, idx) => (
              <div key={section.id} className="bg-secondary/30 p-5 rounded-3xl border border-border/10 group animate-in slide-in-from-right-3 duration-500 hover:border-primary/30 transition-all hover:shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[9px] font-black uppercase text-primary tracking-[0.25em] bg-primary/10 px-3 py-1 rounded-full border border-primary/10">Module {(idx+1).toString().padStart(2, '0')}</span>
                  <button 
                    onClick={() => handleRemoveSection(section.id)}
                    className="w-8 h-8 rounded-lg text-muted-foreground hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <input 
                  type="text" 
                  value={section.title}
                  onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                  className="w-full bg-transparent text-lg font-bold focus:outline-none mb-1 border-b-2 border-transparent focus:border-primary/20 pb-2 transition-all italic tracking-tight"
                  placeholder="Set Module Name..."
                />
                <div className="flex items-center gap-3 mt-4">
                   <div className="flex gap-1">
                      <div className="w-1 h-3 bg-primary animate-music-bar [animation-delay:-0.2s]" />
                      <div className="w-1 h-3 bg-primary animate-music-bar [animation-delay:-0.5s]" />
                      <div className="w-1 h-3 bg-primary animate-music-bar [animation-delay:-0.1s]" />
                   </div>
                   <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{section.type} visualization</span>
                </div>
              </div>
            ))}
            
            {homeSections.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                <Layout className="text-primary/10 mb-6 animate-pulse-subtle" size={64} />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">The home page grid is currently offline. Add a module to begin.</p>
              </div>
            )}
          </div>
        </section>

      </div>
      
    </div>
  );
}


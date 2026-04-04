import { useState, useRef } from 'react';
import { useLibraryStore } from '../store/useLibraryStore';
import { useAuthStore } from '../store/useAuthStore';
import { UploadCloud, CheckCircle2, Layout, Plus, Trash2, Music, Users, Play, Activity, X, FileMusic, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { homeSections, updateHomeSections } = useLibraryStore();
  
  const [uploadStatus, setUploadStatus] = useState(''); // '', 'uploading', 'success', 'error'
  const [songData, setSongData] = useState({ title: '', artist: '', genre: 'Pop' });
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const audioInputRef = useRef(null);

  if (user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] gap-4 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
          <X size={32} />
        </div>
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground">You must have administrator privileges to view this page.</p>
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
      setSongData({ title: '', artist: '', genre: 'Pop' });
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
    { label: 'Total Songs', value: '1,284', icon: <Music size={20} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Users', value: '45.2k', icon: <Users size={20} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Active Streams', value: '12.8k', icon: <Activity size={20} />, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Daily Plays', value: '256k', icon: <Play size={20} />, color: 'text-orange-500', bg: 'bg-orange-500/10' }
  ];

  return (
    <div className="animated-fade-in max-w-6xl mx-auto space-y-10 pb-12">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-extrabold tracking-tight">Admin Control Center</h1>
        <p className="text-muted-foreground text-lg">Manage your music library and home page layout from one place.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-sidebar p-6 rounded-2xl border border-border flex items-center gap-4 hover:shadow-lg transition-all cursor-default">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", stat.bg, stat.color)}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Simplified Upload Process */}
        <section className="lg:col-span-2 bg-sidebar h-fit rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <UploadCloud size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Simplify Upload</h2>
              <p className="text-xs text-muted-foreground">Upload new tracks to the global library</p>
            </div>
          </div>
          
          <form onSubmit={handleUpload} className="p-8 space-y-8">
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => audioInputRef.current?.click()}
              className={cn(
                "group relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer",
                isDragging ? "bg-primary/5 border-primary scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-background/40",
                audioFile ? "border-green-500/50 bg-green-500/5" : ""
              )}
            >
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
                "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
                audioFile ? "bg-green-500 text-white rotate-0" : "bg-accent text-muted-foreground group-hover:scale-110 group-hover:text-primary"
              )}>
                {audioFile ? <CheckCircle2 size={32} /> : <FileMusic size={32} />}
              </div>

              <div className="text-center">
                <h3 className="font-bold text-lg">{audioFile ? "File selected!" : "Click or drag to upload audio"}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {audioFile ? audioFile.name : "MP3, WAV, or FLAC up to 25MB"}
                </p>
              </div>

              {audioFile && (
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setAudioFile(null); }}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-background transition-colors text-muted-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground block mb-1.5 px-1">Song Title</label>
                  <input 
                    required
                    type="text" 
                    value={songData.title}
                    onChange={(e) => setSongData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full h-11 bg-background rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-border"
                    placeholder="e.g. Moonlight Sonata"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground block mb-1.5 px-1">Artist Name</label>
                  <input 
                  required
                    type="text" 
                    value={songData.artist}
                    onChange={(e) => setSongData(prev => ({ ...prev, artist: e.target.value }))}
                    className="w-full h-11 bg-background rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-border"
                    placeholder="Artist, Band, or Creator"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-muted-foreground block mb-1.5 px-1">Cover Artwork (Optional)</label>
                <div className="h-[calc(88px+44px+16px)] border border-border rounded-xl bg-background flex flex-col items-center justify-center gap-2 group/img relative overflow-hidden cursor-pointer hover:border-primary/30 transition-colors">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  <ImageIcon className="text-muted-foreground group-hover/img:text-primary transition-colors" size={24} />
                  <span className="text-xs text-muted-foreground">Upload JPG/PNG</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={uploadStatus === 'uploading' || !audioFile}
                className={cn(
                  "w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all",
                  "bg-foreground text-background hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:grayscale",
                  uploadStatus === 'success' ? "bg-green-500 text-white" : ""
                )}
              >
                {uploadStatus === 'uploading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                    Uploading to Library...
                  </>
                ) : uploadStatus === 'success' ? (
                  <>
                    <CheckCircle2 size={20} />
                    Successfully Added!
                  </>
                ) : (
                  <>
                    <UploadCloud size={20} />
                    Confirm and Upload Track
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Section Management */}
        <section className="bg-sidebar rounded-2xl border border-border flex flex-col overflow-hidden shadow-sm h-fit sticky top-6">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Layout size={20} />
              </div>
              <h2 className="text-xl font-bold">Layout</h2>
            </div>
            <button 
              onClick={handleAddSection}
              className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
            {homeSections.map((section, idx) => (
              <div key={section.id} className="bg-background p-4 rounded-xl border border-border group animate-in slide-in-from-right-2 duration-300">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest bg-accent px-2 py-0.5 rounded">Section {idx+1}</span>
                  <button 
                    onClick={() => handleRemoveSection(section.id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input 
                  type="text" 
                  value={section.title}
                  onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                  className="w-full bg-transparent text-sm font-bold focus:outline-none mb-1 border-b border-transparent focus:border-primary/20 pb-1"
                />
                <div className="flex items-center gap-2 mt-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <span className="text-[10px] font-bold text-muted-foreground uppercase">{section.type} Grid View</span>
                </div>
              </div>
            ))}
            
            {homeSections.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                <Layout className="text-muted-foreground/30 mb-4" size={48} />
                <p className="text-sm text-muted-foreground">No sections created yet. Add one to start customizing the home page.</p>
              </div>
            )}
          </div>
        </section>

      </div>
      
    </div>
  );
}

